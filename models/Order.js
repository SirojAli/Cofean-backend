const {
  shapeIntoMongooseObjectId,
  order_status_enums,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");

const OrderModel = require("../schema/order.model");
const OrderItemModel = require("../schema/order_item.model");
const ProductModel = require("../schema/product.model");

class Order {
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.productModel = ProductModel;
  }

  async createOrderData(member, data) {
    try {
      let order_total_amount = 0,
        order_delivery_cost = 0;
      const mb_id = shapeIntoMongooseObjectId(member._id);
      data.map((item) => {
        order_total_amount +=
          item["quantity"] *
          Math.round((item["price"] * (100 - item["discount"])) / 1000) *
          10;
        order_delivery_cost += item["delivery_fee"];
      });

      const order_id = await this.saveOrderData(
        order_total_amount,
        order_delivery_cost,
        mb_id
      );

      await this.recordOrderItemsData(order_id, data);

      return order_id;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderData(order_total_amount, order_delivery_cost, mb_id) {
    try {
      const new_order = new this.orderModel({
        order_total_amount: order_total_amount,
        order_delivery_cost: order_delivery_cost,
        mb_id: mb_id,
      });
      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err1);
    }
  }

  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveOrderItemsData(item, order_id);
      });
      const results = await Promise.all(pro_list);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderItemsData(item, order_id) {
    try {
      order_id = shapeIntoMongooseObjectId(order_id);
      item._id = shapeIntoMongooseObjectId(item._id);

      const order_item = new this.orderItemModel({
        item_quantity: item["quantity"],
        item_price: item["price"],
        item_delivery_cost: item["delivery_fee"],
        order_id: order_id,
        product_id: item["_id"],
      });
      await this.insertSoldLeftCount(item["_id"], item["quantity"]);
      const result = await order_item.save();
      assert.ok(result, Definer.order_err2);
      return "created";
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err2);
    }
  }
  async insertSoldLeftCount(id, quantity) {
    try {
      await this.productModel
        .findByIdAndUpdate(
          {
            _id: id,
          },
          {
            $inc: {
              product_sold_cnt: quantity * 1,
              product_left_cnt: quantity * -1,
            },
          }
        )
        .exec();
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getMyOrdersData(member, query) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_query = query.status.toUpperCase(),
        order_status =
          order_query === "ALL" ? { $in: order_status_enums } : order_query,
        matches = { mb_id: mb_id, order_status: order_status };
      const result = await this.orderModel
        .aggregate([
          { $match: matches },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "orderitems",
              localField: "_id",
              foreignField: "order_id",
              as: "order_items",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "order_items.product_id",
              foreignField: "_id",
              as: "product_data",
            },
          },
        ])
        .exec();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async editChosenOrderData(member, data) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_id = shapeIntoMongooseObjectId(data.order_id),
        order_status = data.order_status.toUpperCase();

      const result = await this.orderModel.findOneAndUpdate(
        { mb_id: mb_id, _id: order_id }, //filtering query mechanism
        { order_status: order_status },
        { runValidators: true, lean: true, returnDocument: "after" } //options
      );
      assert.ok(result, Definer.order_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Order;
