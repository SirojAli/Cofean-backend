const mongoose = require("mongoose");

exports.mb_type_enums = ["ADMIN", "CAFE", "USER", "DELIVER"];
exports.mb_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.mb_top_enums = ["Y", "N"];

exports.product_collection_enums = ["coffee", "smoothie", "tea", "food"];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["small", "medium", "large", "default"];
exports.product_volume_enums = [240, 355, 473];

exports.order_status_enums = ["PENDING", "PROCESS", "DELIVERED", "CANCELLED"]; // PAUSED=PENDING
exports.like_view_enums = ["member", "product", "blog"]; // member = cafe
exports.blog_status_enums = ["active", "deleted"];

/**********************************
 *    MONGODB RELATED COMMANDS    *
 *********************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};

exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";

  return {
    $lookup: {
      from: "follows",
      let: {
        lc_follow_id: follow_id,
        lc_subscriber_id: mb_id,
        nw_my_following: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$lc_follow_id"] },
                { $eq: ["$subscriber_id", "$$lc_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$nw_my_following",
          },
        },
      ],
      as: "me_followed",
    },
  };
};

exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_liken_item_id: "$_id",
        lc_mb_id: mb_id,
        nw_my_favorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_ref_id", "$$lc_liken_item_id"] },

                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$nw_my_favorite",
          },
        },
      ],
      as: "me_liked",
    },
  };
};
