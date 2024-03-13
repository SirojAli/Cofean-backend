const express = require("express");
const router = express.Router();
const cafeController = require("./controllers/cafeController");
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const followController = require("./controllers/followController");
const blogController = require("./controllers/blogController");
const orderController = require("./controllers/orderController");

const uploader_blog = require("./utils/upload-multer")("blog");
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
  "/blog/image",
  uploader_blog.single("blog_image"),
  blogController.imageInsertion
);
router.post(
  "/blog/create",
  memberController.retrieveAuthMember,
  blogController.createPost
);
router.get(
  "/blog/posts",
  memberController.retrieveAuthMember,
  blogController.getMemberPosts
);
router.get(
  "/blog/target",
  memberController.retrieveAuthMember,
  blogController.getPosts
);
router.get(
  "/blog/single-post/:post_id",
  memberController.retrieveAuthMember,
  blogController.getChosenPost
);

// Following related routers
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
router.get("/follow/followings", followController.getMemberFollowings);
router.get(
  "/follow/followers",
  memberController.retrieveAuthMember,
  followController.getMemberFollowers
);

module.exports = router;
