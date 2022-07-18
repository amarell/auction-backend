let express = require("express");
let mongoose = require("mongoose");
let port = process.env.PORT || 3000;
let config = require("./config.js");
let http = require("http");
let cors = require("cors");
let updateExpiredAuctions = require("./API/jobs/updateExpiredAuctions");
require("dotenv").config();

// Import routes here
let authRoutes = require("./API/routes/auth.js");
let userRoutes = require("./API/routes/userRoutes.js");
let auctionRoutes = require("./API/routes/auctionRoutes.js");
let bidRoutes = require("./API/routes/bidRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Here we will add all the routes!
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", auctionRoutes);
app.use("/api", bidRoutes);

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {
  // console.log("user connected");

  socket.on("open auction", (id) => {
    socket.join(id);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

server.listen(port, function () {
  console.log("Listening on port " + port);
});

const mongo = mongoose.connect(process.env.DB_PATH, config.DB_OPTIONS);

// invoke cron tasks here
updateExpiredAuctions();

mongo
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log(e.message);
  });
