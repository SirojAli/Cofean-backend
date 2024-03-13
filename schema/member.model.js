const mongoose = require("mongoose");
const {
  mb_type_enums,
  mb_status_enums,
  mb_top_enums,
} = require("../lib/config");

const memberSchema = new mongoose.Schema(
  {
    mb_nick: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    mb_password: {
      type: String,
      required: true,
      select: false,
    },
    // **  new added  **
    mb_email: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    mb_phone: {
      type: String,
      required: false,
      // index: { unique: true, sparse: true },
    },
    mb_type: {
      type: String,
      required: false,
      default: "USER",
      enum: {
        values: mb_type_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    mb_status: {
      type: String,
      required: false,
      default: "ACTIVE",
      enum: {
        values: mb_status_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    mb_address: {
      type: String,
      required: false,
    },
    mb_description: {
      type: String,
      required: false,
    },
    mb_image: {
      type: String,
      required: false,
    },
    mb_point: {
      type: String,
      required: false,
      default: 0,
    },
    mb_top: {
      type: String,
      required: false,
      default: "N",
      enum: {
        values: mb_top_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    mb_views: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_follow_count: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_subscriber_count: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
