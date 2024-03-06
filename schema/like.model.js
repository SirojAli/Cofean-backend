const mongoose = require("mongoose");
const { like_view_enums, board_id_enums } = require("../lib/config");
const Scheme = mongoose.Schema;
const likeSchema = new mongoose.Schema(
  {
    mb_id: { type: Scheme.Types.ObjectId, required: true },
    like_ref_id: { type: Scheme.Types.ObjectId, required: true },
    like_group: {
      type: String,
      required: true,
      enum: { values: like_view_enums },
    },
    board_id: {
      type: String,
      required: false,
      enum: {
        values: board_id_enums,
      },
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Like", likeSchema);
