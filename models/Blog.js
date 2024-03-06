const {
  shapeIntoMongooseObjectId,
  board_id_enum_list,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");

const BlogArticleModel = require("../schema/blog.model");
const Member = require("./Member");

class Blog {
  constructor() {
    this.blogArticleModel = BlogArticleModel;
  }

  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_article = await this.saveArticleData(data);
      // console.log("new_article>>>", new_article);
      return new_article;
    } catch (err) {
      throw err;
    }
  }

  async saveArticleData(data) {
    try {
      const article = new this.blogArticleModel(data);
      return await article.save();
    } catch (mongo_err) {
      console.log("mongo_err>>>", mongo_err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async getMemberArticlesData(member, mb_id, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const page = inquiry["page"] ? inquiry["page"] * 1 : 1;
      const limit = inquiry["limit"] ? inquiry["limit"] * 1 : 5;

      const result = await this.blogArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, blog_status: "active" } },
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
      assert.ok(result, Definer.article_err2);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getArticlesData(member, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches =
        inquiry.board_id === "all"
          ? { board_id: { $in: board_id_enum_list }, blog_status: "active" }
          : { board_id: inquiry.board_id, blog_status: "active" };
      inquiry.limit *= 1;
      inquiry.page *= 1;

      const sort = inquiry.order
        ? { [`${inquiry.order}`]: -1 }
        : { createdAt: -1 };

      const result = await this.blogArticleModel
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

      // console.log("result >>", result);
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenArticleData(member, blog_id) {
    try {
      blog_id = shapeIntoMongooseObjectId(blog_id);

      // increase blog_views when user has not seen before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, blog_id, "blog");
      }

      const result = await this.blogArticleModel
        .findById({ _id: blog_id })
        .exec();
      assert.ok(result, Definer.article_err3);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Blog;
