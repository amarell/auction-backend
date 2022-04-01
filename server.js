let express = require("express")
let mongoose = require("mongoose")
let port = process.env.PORT || 3000;
let config = require("./config.js");
let cors = require("cors")
require("dotenv").config();

const app = express();

app.use(cors())

app.listen(port, function () {
    console.log(process.env.DB_PATH)
    console.log("Listening on port " + port)
})

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json())

// Here we will add all the routes!
// app.use("/api", userRoute)

const mongo = mongoose.connect(process.env.DB_PATH, config.DB_OPTIONS);

mongo.then(() => {
    console.log("Connected");
}).catch(e => {
    console.log(e.message);
}) 