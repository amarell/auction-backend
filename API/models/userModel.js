let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
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
    default: "",
  },
  role: {
    type: String,
    default: "NORMAL",
  },
});

let User = mongoose.model("User", userSchema);

module.exports = User;
