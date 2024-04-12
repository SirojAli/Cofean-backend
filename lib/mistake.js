class Definer {
  /** general errors */
  static general_err1 = "attention! Something went wrong!";
  static general_err2 = "attention! There is no data with that params!";
  static general_err3 = "attention! File upload error!";

  /** member auth related errors */
  static auth_err1 = "attention! You are not authenticated!";
  static auth_err2 = "attention! JWT token creation error";
  static auth_err3 = "attention! No member with that mb_nick!";
  static auth_err4 = "attention! Your credentials do not match!";

  /** products related errors */
  static product_err1 = "attention! Product creation is failed!";

  /** orders related errors */
  static order_err1 = "attention! Order creation is failed!";
  static order_err2 = "attention! Order item creation is failed!";
  static order_err3 = "attention! No orders with that params exists!";

  /** posts related errors */
  static post_err1 = "attention! Author member for posts not provided!";
  static post_err2 = "attention! No posts found for that member!";
  static post_err3 = "attention! No posts found for that target!";

  /** follow related errors */
  static follow_err1 = "attention! Self subscription is denied!";
  static follow_err2 = "attention! New follow subscription is failed!";
  static follow_err3 = "attention! No follow data found!";

  /** mongodb related errors */
  static mongo_valid_err1 = "attention! Mongodb validation is failed!";
}

module.exports = Definer;
