console.log("Starting Web Server");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// 1: Entry codes
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    // origin: true,
    origin: ["http://localhost:3000", "https://server.cofean.uz"], // Replace with the exact domains
  })
);

// 2: Session codes
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 720, // 720 minutes for saving cookies
      secure: false, // Use true in production if your app is served over HTTPS
      // secure: process.env.NODE_ENV === "production", // Ensure cookies are sent only over HTTPS
      // sameSite: "None", // setting this for cross-site cookies
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  console.log(req.session.member); // Log the session data for debugging
  res.locals.member = req.session.member;
  next();
});

// 3: Views codes
// app.set("views", "views");
// app.set("views", path.join(__dirname, "views"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// 4: Routing codes
app.use("/cafe", router_bssr); // for admin and cafe users (BSSR)
app.use("/", router); // for cafe clients (SPA)

module.exports = app;
