// const MemberModel = require("../schema/member.model");
// const LikeModel = require("../schema/like.model");
// const ProductModel = require("../schema/product.model");
// const BlogPostModel = require("../schema/board_post.model");
// const Definer = require("../lib/mistake");

// class Like {
//   constructor(mb_id) {
//     this.likeModel = LikeModel;
//     this.memberModel = MemberModel;
//     this.productModel = ProductModel;
//     this.blogPostModel = BlogPostModel;
//     this.mb_id = mb_id;
//   }

//   async validateTargetItem(id, group_type) {
//     try {
//       let result;
//       switch (group_type) {
//         case "member":
//           result = await this.memberModel
//             .findOne({
//               _id: id,
//               mb_status: "ACTIVE",
//             })
//             .exec();
//           break;

//         case "product":
//           result = await this.productModel
//             .findOne({
//               _id: id,
//               product_status: "PROCESS",
//             })
//             .exec();
//           break;

//         case "blog":
//         default:
//           result = await this.blogPostModel
//             .findOne({
//               _id: id,
//               post_status: "active",
//             })
//             .exec();
//           break;
//       }

//       return !!result;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async checkLikeExistence(like_ref_id) {
//     try {
//       const like = await this.likeModel
//         .findOne({
//           mb_id: this.mb_id,
//           like_ref_id: like_ref_id,
//         })
//         .exec();
//       console.log("like>>>", like);

//       return !!like;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async removeMemberLike(like_ref_id, group_type) {
//     try {
//       const result = await this.likeModel
//         .findOneAndDelete({
//           like_ref_id: like_ref_id,
//           mb_id: this.mb_id,
//         })
//         .exec();

//       await this.modifyItemLikeCounts(like_ref_id, group_type, -1);

//       return result;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async insertMemberLike(like_ref_id, group_type) {
//     try {
//       const new_like = await this.likeModel({
//         mb_id: this.mb_id,
//         like_ref_id: like_ref_id,
//         like_group: group_type,
//       });

//       const result = await new_like.save();
//       await this.modifyItemLikeCounts(like_ref_id, group_type, 1);

//       return result;
//     } catch (err) {
//       console.log(err);
//       throw new Error(Definer.mongo_validation_err1);
//     }
//   }

//   async modifyItemLikeCounts(like_ref_id, group_type, modifier) {
//     try {
//       switch (group_type) {
//         case "member":
//           await this.memberModel
//             .findByIdAndUpdate(
//               { _id: like_ref_id },
//               { $inc: { mb_likes: modifier } }
//             )
//             .exec();
//           break;

//         case "product":
//           await this.productModel
//             .findByIdAndUpdate(
//               { _id: like_ref_id },
//               { $inc: { product_likes: modifier } }
//             )
//             .exec();
//           break;

//         case "blog":
//           await this.blogPostModel
//             .findByIdAndUpdate(
//               { _id: like_ref_id },
//               { $inc: { post_likes: modifier } }
//             )
//             .exec();
//           break;
//       }
//       return true;
//     } catch (err) {
//       throw err;
//     }
//   }
// }
// module.exports = Like;
