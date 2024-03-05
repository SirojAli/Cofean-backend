const assert = require("assert");
const Definer = require("../lib/mistake");
const Member = require("../models/Member");
const Product = require("../models/Product");
const Cafe = require("../models/Cafe");
let cafeController = module.exports;

cafeController.getCafes = async (req, res) => {
  try {
    console.log("GET: cont/getCafes");
    const data = req.query;
    // console.log("query data:::", data);
    // res.send("DONE!");
    const cafe = new Cafe();
    const result = await cafe.getCafesData(req.member, data);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getCafes, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

cafeController.getChosenCafe = async (req, res) => {
  try {
    console.log("GET: cont/getChosenCafe");
    const id = req.params.id;
    // console.log("id:::", id);

    const cafe = new Cafe();
    const result = await cafe.getChosenCafeData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenCafe, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

/********************************************
 *        BSSR RELATED METHODS              *
 ********************************************/

cafeController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};

cafeController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signupProcess");
    console.log("body >>", req.body);
    console.log("file >>", req.file);
    assert(req.file, Definer.general_err3);

    let new_member = req.body;
    new_member.mb_type = "CAFE";
    new_member.mb_image = req.file.path.replace(/\\/g, "/");
    console.log(req.file.path);

    const member = new Member();
    const result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1);

    req.session.member = result;
    console.log("session:::", result);
    res.redirect("/cafe/products/menu");
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log(`ERROR, cont/signupProcess, ${err.message} `);
  }
};

cafeController.getSignupMyCafe = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyCafe");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyCafe, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};

cafeController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/loginProcess");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);

    // SESSION AUTHENTICATION
    req.session.member = result;
    req.session.save(() => {
      result.mb_type === "ADMIN"
        ? res.redirect("/cafe/all-cafes")
        : res.redirect("/cafe/products/menu");
    });
  } catch (err) {
    // res.json({ state: "failed", message: err.message });
    res.redirect("/cafe/login");
    console.log(`ERROR, cont/loginProcess, ${err.message} `);
  }
};

cafeController.getLoginMyCafe = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyCafe");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyCafe, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};

cafeController.logout = (req, res) => {
  try {
    console.log("GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/cafe");
    });
  } catch (err) {
    res.redirect("/cafe/login");
    console.log(`ERROR, cont/logout, ${err.message} `);
  }
};

cafeController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "failed", message: "You are not authenticated" });
  }
};

cafeController.validateAuthCafe = (req, res, next) => {
  if (req.session?.member?.mb_type === "CAFE") {
    req.member = req.session.member;
    next();
  }
  // res.redirect("/cafe");
  else
    res.json({
      state: "failed",
      message: "only authenticated members with CAFE type",
    });
};

cafeController.getMyCafeProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyCafeProducts");
    console.log(req.member);
    const product = new Product();
    // const data = await product.getMyCafeProductsData(req.locals.member);
    const data = await product.getMyCafeProductsData(req.member);

    res.render("cafe-menu", { cafe_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyCafeProducts, ${err.message} `);
    // res.json({ state: "failed", message: err.message });
    res.redirect("/cafe");
  }
};

cafeController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
            alert("Admin Page: Permission denied!");
            window.location.replace('/cafe');
          </script>`;
    res.end(html);
  }
};

cafeController.getAllCafes = async (req, res) => {
  try {
    console.log("GET cont/getAllCafes");

    const cafe = new Cafe();
    const cafe_data = await cafe.getAllCafesData();
    // console.log("cafe_data >>", cafe_data);

    res.render("all-cafes", { cafe_data: cafe_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllCafes, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};

cafeController.updateCafeByAdmin = async (req, res) => {
  try {
    console.log("GET cont/updateCafeByAdmin");

    const cafe = new Cafe();
    const result = await cafe.updateCafeByAdminData(req.body);
    await res.json({ state: "succeed", data: result });

    // todo: hamma cafelarni db dan chaqiramiz
    // res.render("all-cafes", { cafe_data: cafe_data });
  } catch (err) {
    console.log(`ERROR, cont/updateCafeByAdmin, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};
