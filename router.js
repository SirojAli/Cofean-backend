const express = require("express");
const router = express.Router();
const cafeController = require("./controllers/cafeController");
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const followController = require("./controllers/followController");
const blogController = require("./controllers/blogController");
const orderController = require("./controllers/orderController");

const uploader_blog = require("./utils/upload-multer")("blogs");
const uploader_member = require("./utils/upload-multer")("members");

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
router.post(
  "/member-liken",
  memberController.retrieveAuthMember,
  memberController.likeMemberChosen
);

// Cafe related routers
router.get(
  "/cafes",
  memberController.retrieveAuthMember,
  cafeController.getCafes
);
router.get(
  "/cafes/:id",
  memberController.retrieveAuthMember,
  cafeController.getChosenCafe
);

// Product related routers
router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);
router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

// Review related routers
router.post(
  "/review/create",
  memberController.retrieveAuthMember,
  memberController.createReview
);
router.post("/reviews", memberController.getReviews);

// Order related routers
router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);
router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);
router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);

// Blog related routers
router.post(
  "/blogs/create",
  memberController.retrieveAuthMember,
  uploader_blog.single("blog_image"),
  blogController.createBlog
);
router.get(
  "/blogs/posts",
  memberController.retrieveAuthMember,
  blogController.getBlogs
);

router.get(
  "/blogs/single-blog/:blog_id",
  memberController.retrieveAuthMember,
  blogController.getChosenBlog
);

// Follow related routers
router.post(
  "/follow/subscribe",
  memberController.retrieveAuthMember,
  followController.subscribe
);
router.post(
  "/follow/unsubscribe",
  memberController.retrieveAuthMember,
  followController.unsubscribe
);
router.get("/follow/followings", followController.getFollowings);
router.get(
  "/follow/followers",
  memberController.retrieveAuthMember,
  followController.getFollowers
);

module.exports = router;
