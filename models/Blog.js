const {
  shapeIntoMongooseObjectId,
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

  async createBlogData(member, data, image) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const blogData = {
        blog_title: data.blog_title,
        blog_content: data.blog_content,
        blog_image: image ? image.path.replace(/\\/g, "/") : null,
        mb_id: mb_id,
      };

      const new_blog = await this.saveBlogData(blogData);
      return new_blog;
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

  async getBlogsData(member, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id),
        page = inquiry["page"] ? inquiry["page"] * 1 : 1,
        mb_id = inquiry.mb_id,
        limit = inquiry["limit"] ? inquiry["limit"] * 1 : 5;
      let match;
      switch (mb_id) {
        case "all":
          match = { blog_status: "active" };
          break;
        case "none":
          match = { mb_id: auth_mb_id, blog_status: "active" };
          break;
        default:
          match = {
            mb_id: shapeIntoMongooseObjectId(mb_id),
            blog_status: "active",
          };
          break;
      }
      const result = await this.blogModel
        .aggregate([
          { $match: match },
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
        ])
        .exec();
      assert.ok(result, Definer.blog_err2);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenBlogData(member, blog_id) {
    try {
      blog_id = shapeIntoMongooseObjectId(blog_id);
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
}

module.exports = Blog;
