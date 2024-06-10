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

blogController.createBlog = async (req, res) => {
  try {
    console.log("POST: cont/createBlog");
    console.log("Uploaded file: ", req.file);
    const blog = new Blog();
    const result = await blog.createBlogData(req.member, req.body, req.file);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createBlog, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getBlogs = async (req, res) => {
  try {
    console.log("GET: cont/getBlogs");
    console.log("query >>>", req.query);
    const blog = new Blog();

    const result = await blog.getBlogsData(req.member, req.query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR cont/getBlogs >>> ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getChosenBlog = async (req, res) => {
  try {
    console.log("GET: cont/getChosenBlog");

    const blog_id = req.params.blog_id;
    console.log("blog_id>>>", blog_id);
    const blog = new Blog();

    const result = await blog.getChosenBlogData(req.member, blog_id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenBlog, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
