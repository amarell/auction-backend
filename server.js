let express = require("express");
let mongoose = require("mongoose");
let port = process.env.PORT || 3000;
let config = require("./config.js");
let cors = require("cors");
require("dotenv").config();

// Import routes here
let authRoutes = require("./API/routes/auth.js");
let userRoutes = require("./API/routes/userRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(port, function () {
  console.log("Listening on port " + port);
});

// Here we will add all the routes!
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const mongo = mongoose.connect(process.env.DB_PATH, config.DB_OPTIONS);

mongo
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e.message);
  });
