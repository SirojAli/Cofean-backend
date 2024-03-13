const {
  shapeIntoMongooseObjectId,
  board_id_enums,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");

const BlogPostModel = require("../schema/blog.model");
const Member = require("./Member");

class Blog {
  constructor() {
    this.blogPostModel = BlogPostModel;
  }

  async createPostData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_post = await this.savePostData(data);
      console.log("new_post>>>", new_post);
      return new_post;
    } catch (err) {
      throw err;
    }
  }

  async savePostData(data) {
    try {
      const post = new this.blogPostModel(data);
      return await post.save();
    } catch (mongo_err) {
      console.log("mongo_err>>>", mongo_err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async getMemberPostsData(member, mb_id, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const page = inquiry["page"] ? inquiry["page"] * 1 : 1;
      const limit = inquiry["limit"] ? inquiry["limit"] * 1 : 5;

      const result = await this.blogPostModel
        .aggregate([
          { $match: { mb_id: mb_id, post_status: "active" } },
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
          lookup_auth_member_liked(auth_mb_id),
          // todo: check auth liked the chosen target
        ])
        .exec();
      assert.ok(result, Definer.post_err2);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getPostsData(member, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches =
        inquiry.board_id === "all"
          ? { board_id: { $in: board_id_enums }, post_status: "active" }
          : { board_id: inquiry.board_id, post_status: "active" };
      inquiry.limit *= 1;
      inquiry.page *= 1;

      const sort = inquiry.order
        ? { [`${inquiry.order}`]: -1 }
        : { createdAt: -1 };

      const result = await this.blogPostModel
        .aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquiry.page - 1) * inquiry.limit },
          { $limit: inquiry.limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
          // todo: check auth liked the chosen target
        ])
        .exec();

      console.log("result >>", result);
      assert.ok(result, Definer.post_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenPostData(member, post_id) {
    try {
      post_id = shapeIntoMongooseObjectId(post_id);

      // increase post_views when user has not seen before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, post_id, "blog");
      }

      const result = await this.blogPostModel.findById({ _id: post_id }).exec();
      assert.ok(result, Definer.post_err3);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Blog;
