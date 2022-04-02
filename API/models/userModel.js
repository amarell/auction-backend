let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  full_name: String,
  bio: {
    type: String,
    default: "",
  },
  username: String,
  password: String,
  email: String,
  age: Number,
  phone_number: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  profile_picture: {
    type: String,
    default: "https://image.flaticon.com/icons/png/512/3048/3048189.png",
  },
  role: {
    type: String,
    default: "NORMAL",
  },
});

let User = mongoose.model("User", userSchema);

module.exports = User;
