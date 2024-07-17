const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const ReviewModel = require("../schema/review.model");
const BlogModel = require("../schema/blog.model");

class Review {
  constructor(mb_id) {
    this.reviewModel = ReviewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.blogModel = BlogModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarget(review_ref_id, group_type) {
    try {
      console.log(
        "Validating chosen target with >>>",
        review_ref_id,
        group_type
      );
      let result;
      switch (group_type) {
        case "product":
          result = await this.productModel
            .findOne({
              _id: review_ref_id,
              product_status: "PROCESS",
            })
            .exec();
          break;
        case "blog":
          result = await this.blogModel
            .findOne({
              _id: review_ref_id,
              blog_status: "active",
            })
            .exec();
          break;
      }
      console.log("Validation result >>>", result);
      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberReview(review_ref_id, group_type, content, product_rating) {
    try {
      const new_review = product_rating
        ? new this.reviewModel({
            mb_id: this.mb_id,
            review_ref_id: review_ref_id,
            review_group: group_type,
            content: content,
            product_rating: product_rating,
          })
        : new this.reviewModel({
            mb_id: this.mb_id,
            review_ref_id: review_ref_id,
            review_group: group_type,
            content: content,
          });
      const result = await new_review.save();
      await this.modifyItemViewCounts(
        review_ref_id,
        group_type,
        product_rating
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItemViewCounts(review_ref_id, group_type, product_rating) {
    try {
      switch (group_type) {
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              {
                $inc: { product_rating: product_rating, product_reviews: 1 },
              }
            )
            .exec();
          break;
        case "blog":
          await this.blogModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              { $inc: { blog_reviews: 1 } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Review;
