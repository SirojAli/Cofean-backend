// MEMBER SERVICE MODEL (file nomi js shu fileni class sifatida qabul qilishi uchun bosh harfda yozildi)
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_following,
  lookup_auth_member_liked,
} = require("../lib/config");

const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const View = require("./View");
const Like = require("./Like");
const ReviewModel = require("../schema/review.model");

const Review = require("./Review");

class Member {
  constructor() {
    this.memberModel = MemberModel;
    this.reviewModel = ReviewModel;
  }
  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);

      const new_member = new this.memberModel(input);
      let result;
      try {
        result = await new_member.save();
      } catch (mongo_err) {
        throw new Error(Definer.mongo_valid_err1);
      }
      result.mb_password = "";
      console.log("signdata--------", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 })
        .exec();
      assert.ok(member, Definer.auth_err3);
      console.log("member >>", member);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );
      assert.ok(isMatch, Definer.auth_err4);

      const result = await this.memberModel
        .findOne({ mb_nick: input.mb_nick })
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenMemberData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);
      console.log("member>>>", member);

      let aggregationQuery = [
        { $match: { _id: id, mb_status: "ACTIVE" } },
        { $unset: "mb_password" }, // mb_password ni ko'rsatmaslik uchun
      ];

      if (member) {
        await this.viewChosenItemByMember(member, id, "member");

        // todo: check auth member liked the chosen member
        aggregationQuery.push(lookup_auth_member_liked(auth_mb_id));
        aggregationQuery.push(
          lookup_auth_member_following(auth_mb_id, "members")
        );
      }

      const result = await this.memberModel.aggregate(aggregationQuery).exec();

      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      // validation needed
      const view = new View(mb_id);
      const isValid = await view.validateChosenTarget(view_ref_id, group_type);
      console.log("isValid>>>", isValid);
      assert.ok(isValid, Definer.general_err2);

      // logged user has seen target before
      const doesExist = await view.checkViewExistence(view_ref_id);
      console.log("doesExist : ", doesExist);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async likeChosenItemByMember(member, like_ref_id, group_type) {
    try {
      like_ref_id = shapeIntoMongooseObjectId(like_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const like = new Like(mb_id);
      const isValid = await like.validateTargetItem(like_ref_id, group_type);
      console.log("isValid>>>", isValid);
      assert.ok(isValid, Definer.general_err2);

      const doesExist = await like.checkLikeExistence(like_ref_id);
      console.log("doesExist>>", doesExist);

      let data = doesExist
        ? await like.removeMemberLike(like_ref_id, group_type)
        : await like.insertMemberLike(like_ref_id, group_type);
      assert.ok(data, Definer.general_err1);

      const result = {
        like_group: data.like_group,
        like_ref_id: data.like_ref_id,
        like_status: doesExist ? 0 : 1,
      };
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateMemberData(id, data, image) {
    try {
      const mb_id = shapeIntoMongooseObjectId(id);
      let params = {
        mb_nick: data.mb_nick,
        mb_email: data.mb_email,
        mb_address: data.mb_address,
        mb_description: data.mb_description,
        mb_image: image ? image.path.replace(/\\/g, "/") : null,
      };

      for (let prop in params) if (!params[prop]) delete params[prop];
      const result = await this.memberModel
        .findOneAndUpdate({ _id: mb_id }, params, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async createReviewData(member, data) {
    try {
      const review_ref_id = shapeIntoMongooseObjectId(data.review_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const review = new Review({
        mb_id: mb_id,
        review_ref_id: review_ref_id,
        review_group: data.review_group,
        title: data.title,
        content: data.content,
        product_rating: data.product_rating ? data.product_rating : 0,
      });
      const isValid = await review.validateChosenTarget(
        review_ref_id,
        data.group_type
      );
      assert.ok(isValid, Definer.general_err2);

      const result = await review.insertMemberReview(
        review_ref_id,
        data.group_type,
        data.title,
        data.content,
        data.product_rating
      );
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getReviewsData(data) {
    try {
      const review_ref_id = shapeIntoMongooseObjectId(data.review_ref_id);
      const page = data.page * 1;
      const limit = data.limit * 1;
      const result = await this.reviewModel
        .aggregate([
          { $match: { review_ref_id: review_ref_id } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
        ])
        .exec();
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
