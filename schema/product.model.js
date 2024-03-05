const mongoose = require("mongoose");
const {
  product_collection_enums,
  product_status_enums,
  product_size_enums,
  product_volume_enums,
} = require("../lib/config");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    product_status: {
      type: String,
      required: false,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      required: true,
      default: 0,
    },
    product_left_count: {
      type: Number,
      required: true,
    },
    // for coffee, tea, smoothies
    product_volume: {
      type: Number,
      default: 355,
      required: function () {
        return ["coffee", "smoothie", "tea"].includes(this.product_collection);
      },
      enum: {
        values: product_volume_enums,
        message: "{VALUES} is not among permitted values",
      },
    },
    // for food and cakes & goods and card
    product_size: {
      type: String,
      required: function () {
        const sized_list = ["food", "card"];
        return sized_list.includes(this.product_collection);
      },
      default: "default",
      enum: {
        values: product_size_enums,
        message: "{VALUES} is not among permitted values",
      },
    },

    product_description: {
      type: String,
      required: false,
    },
    product_images: {
      type: Array,
      required: true,
      default: [],
    },
    product_views: {
      type: Number,
      required: false,
      default: 0,
    },
    product_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    cafe_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

// below: DBga 1xil tovar,1xil size ni yozmasin, agar b-a, ustiga add qilsin
productSchema.index(
  {
    cafe_mb_id: 1,
    product_name: 1,
    product_size: 1,
    product_volume: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
