const express = require("express");
const router = express.Router();
// const cafeController = require("./controllers/cafeController");
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
// const followController = require("./controllers/followController");
// const communityController = require("./controllers/communityController");
// const orderController = require("./controllers/orderController");

/********************
 *     REST API     *
 ********************/

// Member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);

// Product related routers
router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

// Cafe related routers
// Order related routers
// Community related routers
// Following related routers

module.exports = router;
