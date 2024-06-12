const mongoose = require("mongoose");
const { like_view_enums, blog_type_enums } = require("../lib/config");
const Scheme = mongoose.Schema;
const viewSchema = new mongoose.Schema(
  {
    mb_id: { type: Scheme.Types.ObjectId, required: true },
    view_ref_id: { type: Scheme.Types.ObjectId, required: true },
    view_group: {
      type: String,
      required: true,
      enum: { values: like_view_enums },
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("View", viewSchema);
