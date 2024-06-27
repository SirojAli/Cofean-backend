const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async addNewProductData(data, member) {
    try {
      data.cafe_mb_id = shapeIntoMongooseObjectId(member._id);
      const new_product = new this.productModel(data);

      const result = await new_product.save();
      assert.ok(result, Definer.product_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);

      // next: do what you should do with that logic
      mb_id = shapeIntoMongooseObjectId(mb_id);

      const result = await this.productModel
        .findOneAndUpdate({ _id: id, cafe_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMyCafeProductsData(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.productModel.find({
        cafe_mb_id: member._id,
      });

      assert.ok(result, Definer.general_err1);
      console.log("result >>", result);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      // Convert data.limit and data.page to numbers
      const limit = parseInt(data.limit); // Convert limit to number
      const page = parseInt(data.page); // Convert page to number

      // Ensure data.price is defined and has at least two elements
      const min_price = data.price && data.price[0] ? data.price[0] * 1000 : 0;
      const max_price =
        data.price && data.price[1] ? data.price[1] * 1000 : 12000;

      // Check if cafe_mb_id is present and convert it to Mongoose ObjectId
      let cafeMbId = null;
      if (data.cafe_mb_id) {
        cafeMbId = shapeIntoMongooseObjectId(data.cafe_mb_id);
      }

      // Construct the match query based on data properties
      const match = {
        product_status: "PROCESS",
        product_collection: { $in: data.product_collection },
        // Only include cafe_mb_id if it's valid
        ...(cafeMbId && { cafe_mb_id: cafeMbId }),
      };

      // Add additional conditions based on data.search
      if (data.search !== "") {
        match.$or = [
          { product_price: { $gt: min_price, $lt: max_price } },
          {
            product_name: { $regex: ".*" + data.search + ".*", $options: "i" },
          },
        ];
      } else {
        match.product_price = { $gt: min_price, $lt: max_price };
      }

      // Determine sort order based on data.order
      const sort = {};
      if (data.order === "product_price") {
        sort[data.order] = 1; // Ascending order for product_price
      } else {
        sort[data.order] = -1; // Descending order for other fields
      }

      // Execute the aggregation pipeline
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      // Check if result is valid
      if (!result) {
        throw new Error("No data found");
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "product");
      }

      const result = await this.productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },

          // todo: check auth member product likes
          lookup_auth_member_liked(auth_mb_id),
        ])

        .exec();

      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Product;
