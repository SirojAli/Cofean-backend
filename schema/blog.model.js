const mongoose = require("mongoose");
const { blog_type_enums, blog_status_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    blog_title: { type: String, required: true },
    blog_content: { type: String, required: true },
    blog_image: { type: String, required: false },
    blog_status: {
      type: String,
      required: false,
      default: "active",
      enum: {
        values: blog_status_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    blog_likes: { type: Number, required: false, default: 0 },
    blog_views: { type: Number, required: false, default: 0 },
    blog_reviews: { type: Number, required: false, default: 0 },
    mb_id: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
