const Blog = require("../models/Blog");
let blogController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");

blogController.imageInsertion = async (req, res) => {
  try {
    console.log("POST: cont/imageInsertion");
    assert.ok(req.file, Definer.general_err3);
    const image_url = req.file.path.replace(/\\/g, "/");

    res.json({ state: "success", data: image_url });
  } catch (err) {
    console.log(`ERROR, cont/imageInsertion, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.createArticle = async (req, res) => {
  try {
    console.log("POST: cont/createArticle");

    // blog service model
    const blog = new Blog();
    const result = await blog.createArticleData(req.member, req.body);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createArticle, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getMemberArticles = async (req, res) => {
  try {
    console.log("GET: cont/getMemberArticles");
    const blog = new Blog();

    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id;
    assert.ok(mb_id, Definer.article_err1);

    const result = await blog.getMemberArticlesData(
      req.member,
      mb_id,
      req.query
    );

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMemberArticles, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getArticles = async (req, res) => {
  try {
    console.log("GET: cont/getArticles");
    // console.log("query>>>", req.query);
    const blog = new Blog();

    const result = await blog.getArticlesData(req.member, req.query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getArticles, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getChosenArticle = async (req, res) => {
  try {
    console.log("GET: cont/getChosenArticle");

    const blog_id = req.params.blog_id;
    // console.log("blog_id>>>", blog_id);
    const blog = new Blog();

    const result = await blog.getChosenArticleData(req.member, blog_id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenArticle, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
