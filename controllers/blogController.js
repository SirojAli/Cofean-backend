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

blogController.createPost = async (req, res) => {
  try {
    console.log("POST: cont/createPost");

    // blog service model
    const blog = new Blog();
    const result = await blog.createPostData(req.member, req.body);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createPost, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getMemberPosts = async (req, res) => {
  try {
    console.log("GET: cont/getMemberPosts");
    const blog = new Blog();

    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id;
    assert.ok(mb_id, Definer.post_err1);

    const result = await blog.getMemberPostsData(req.member, mb_id, req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMemberPosts, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getPosts = async (req, res) => {
  try {
    console.log("GET: cont/getPosts");
    // console.log("query>>>", req.query);
    const blog = new Blog();

    const result = await blog.getPostsData(req.member, req.query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getPosts, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getChosenPost = async (req, res) => {
  try {
    console.log("GET: cont/getChosenpost");

    const post_id = req.params.post_id;
    console.log("post_id>>>", post_id);
    const blog = new Blog();

    const result = await blog.getChosenPostData(req.member, post_id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenPost, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
