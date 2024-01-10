const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");

/********************
 *     REST API     *
 ********************/

// Member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);

// Product related routers
// Cafe related routers
// Order related routers
// Community related routers
// Following related routers

module.exports = router;
