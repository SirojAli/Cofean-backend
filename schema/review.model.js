const mongoose = require("mongoose");
const { like_view_enums } = require("../lib/config");
const Scheme = mongoose.Schema;
const reviewScheme = new mongoose.Schema(
  {
    mb_id: { type: Scheme.Types.ObjectId, required: true },
    review_ref_id: { type: Scheme.Types.ObjectId, required: true },
    review_group: {
      type: String,
      required: true,
      enum: { values: like_view_enums },
    },
    title: { type: String, required: true },
    content: { type: String, required: false },
    product_rating: { type: Number, required: false },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Review", reviewScheme);
