const mongoose = require("mongoose");
const { blog_id_enums, blog_status_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const blogPostSchema = new mongoose.Schema(
  {
    post_subject: {
      type: String,
      required: true,
    },
    post_content: {
      type: String,
      required: true,
    },
    post_image: {
      type: String,
      required: false, // change true
    },
    board_id: {
      type: String,
      required: true,
      enum: {
        values: blog_id_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    post_status: {
      type: String,
      required: false,
      default: "active",
      enum: {
        values: blog_status_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    post_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    post_views: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
