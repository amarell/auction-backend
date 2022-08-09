let mongoose = require("mongoose");

let ratingSchema = new mongoose.Schema({
  created_for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
});

let Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
