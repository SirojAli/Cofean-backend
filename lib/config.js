const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "CAFE"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.member_top_enums = ["Y", "N"];

exports.product_collection_enums = ["dish", "salad", "dessert", "drink", "etc"];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["small", "normal", "large", "set"];
exports.product_volume_enums = [0.5, 1, 1.25, 1.5, 2];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_enums = ["product", "member", "community"];

exports.board_id_enums = ["celebrity", "evaluation", "story"];
exports.boArticle_status_enums = ["active", "deleted"];

/**********************************
 *    MONGODB RELATED COMMANDS    *
 *********************************/
