const Blog = require("../models/Blog");
let blogController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");

// blogController.createBlog = async (req, res) => {
//   try {
//     console.log("POST: cont/createBlog");

//     const blog = new Blog();
//     const result = await blog.createBlogData(req.member, req.body);
//     assert.ok(result, Definer.general_err1);

//     res.json({ state: "success", data: result });
//   } catch (err) {
//     console.log(`ERROR, cont/createBlog, ${err.message} `);
//     res.json({ state: "fail", message: err.message });
//   }
// };

blogController.createBlog = async (req, res) => {
  try {
    console.log("POST: cont/createBlog");

    // Validate incoming blog_image
    if (req.body.blog_image && !Array.isArray(req.body.blog_image)) {
      throw new Error("blog_image must be an array of strings");
    }

    const blog = new Blog();
    const result = await blog.createBlogData(req.member, req.body);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/createBlog, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

blogController.getBlogs = async (req, res) => {
  try {
    console.log("GET: cont/getBlogs");
    // console.log("query>>>", req.query);
    const blog = new Blog();

    const result = await blog.getBlogsData(req.member, req.query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getBlogs, ${err.message} `);
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

blogController.getMemberBlogs = async (req, res) => {
  try {
    console.log("GET: cont/getMemberBlogs");
    const blog = new Blog();

    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id;
    assert.ok(mb_id, Definer.blog_err1);

    const result = await blog.getMemberBlogsData(req.member, mb_id, req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getMemberBlogs, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
