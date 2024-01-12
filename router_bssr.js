const express = require("express");
const router_bssr = express.Router();
const cafeController = require("./controllers/cafeController");

// const productController = require("./controllers/productController");
// const uploader_product = require("./utils/upload-multer")("products");
// const uploader_member = require("./utils/upload-multer")("members");

/********************
 *     BSSR EJS     *
 ********************/

// Signup Router for Signup Process
router_bssr
  .get("/signup", cafeController.getSignupMyCafe)
  .post("/signup", cafeController.signupProcess);

// Login Router for Login Process
router_bssr
  .get("/login", cafeController.getLoginMyCafe)
  .post("/login", cafeController.loginProcess);

router_bssr.get("/logout", cafeController.logout);
router_bssr.get("/check-me", cafeController.checkSessions);

router_bssr.get("/products/menu", cafeController.getMyCafeData);

module.exports = router_bssr;

// router_bssr.post(
//   "/products/create",
//   cafeController.validateAuthCafe,
//   uploader_product.array("product_images", 5),
//   productController.addNewProduct
// );
// router_bssr.post(
//   "/products/edit/:id",
//   cafeController.validateAuthCafe,
//   productController.updateChosenProduct
// );

// router_bssr.get(
//   "/all-cafe",
//   cafeController.validateAdmin,
//   cafeController.getAllCafes
// );

// router_bssr.post(
//   "/all-cafes/edit",
//   cafeController.validateAdmin,
//   cafeController.updateCafeByAdmin
// );
