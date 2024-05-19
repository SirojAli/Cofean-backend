const {
  shapeIntoMongooseObjectId,
  blog_type_enums,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");

const BlogModel = require("../schema/blog.model");
const Member = require("./Member");

class Blog {
  constructor() {
    this.blogModel = BlogModel;
  }

  async createBlogData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_blog = await this.saveBlogData(data);
      console.log("new_blog >>>", new_blog);
      return new_blog;
    } catch (err) {
      throw err;
    }
  }

  async getBlogsData(member, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches =
        inquiry.blog_types === "all"
          ? { blog_types: { $in: blog_type_enums }, blog_status: "active" }
          : { blog_types: inquiry.blog_types, blog_status: "active" };
      inquiry.limit *= 1;
      inquiry.page *= 1;

      const sort = inquiry.order
        ? { [`${inquiry.order}`]: -1 }
        : { createdAt: -1 };

      const result = await this.blogModel
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
      assert.ok(result, Definer.blog_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenBlogData(member, blog_id) {
    try {
      blog_id = shapeIntoMongooseObjectId(blog_id);

      // increase blog_views when user has not seen before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, blog_id, "blog");
      }

      const result = await this.blogModel.findById({ _id: blog_id }).exec();
      assert.ok(result, Definer.blog_err3);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async saveBlogData(data) {
    try {
      const blog = new this.blogModel(data);
      return await blog.save();
    } catch (mongo_err) {
      console.log("mongo_err >>>", mongo_err);
      throw new Error(Definer.mongo_valid_err1);
    }
  }

  async getMemberBlogsData(member, mb_id, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const page = inquiry["page"] ? inquiry["page"] * 1 : 1;
      const limit = inquiry["limit"] ? inquiry["limit"] * 1 : 5;

      const result = await this.blogModel
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

          // todo: check auth liked the chosen target
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.blog_err2);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Blog;
