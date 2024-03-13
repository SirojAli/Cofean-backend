const assert = require("assert");
const Definer = require("../lib/mistake");
const Follow = require("../models/Follow");
let followController = module.exports;

followController.subscribe = async (req, res) => {
  try {
    console.log("POST: cont/subscribe");
    assert.ok(req.member, Definer.auth_err1);

    const follow = new Follow();
    await follow.subscribeData(req.member, req.body);
    res.json({ state: "success", data: "subscribed" });
  } catch (err) {
    console.log(`ERROR, cont/subscribe, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

followController.unsubscribe = async (req, res) => {
  try {
    console.log("POST: cont/unsubscribe");
    assert.ok(req.member, Definer.auth_err1);

    const follow = new Follow();
    await follow.unsubscribeData(req.member, req.body);
    res.json({ state: "success", data: "unsubscribed" });
  } catch (err) {
    console.log(`ERROR, cont/unsubscribe, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

followController.getFollowings = async (req, res) => {
  try {
    console.log("POST: cont/getFollowings");

    const follow = new Follow();
    const result = await follow.getFollowingsData(req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getFollowings, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

followController.getFollowers = async (req, res) => {
  try {
    console.log("POST: cont/getFollowers");

    const follow = new Follow();
    const result = await follow.getFollowersData(req.member, req.query);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getFollowers, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
