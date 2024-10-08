const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const mongoose = require("mongoose");

// Set strictQuery to true to avoid deprecation warnings and prepare for future changes
mongoose.set("strictQuery", false);

const connectionString = process.env.MONGO_URL;
mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, goose) => {
    if (err) console.log("Error on connection MongoDB");
    else {
      console.log("MongoDB connection succeed");
      console.log("goose >>", goose);

      const app = require("./app");
      const server = http.createServer(app);
      let PORT = process.env.PORT || 3003;
      server.listen(PORT, "0.0.0.0", function () {
        console.log(
          `This server is running succesfully on port: ${PORT}, http://localhost:${PORT}`
        );
      });
    }
  }
);
