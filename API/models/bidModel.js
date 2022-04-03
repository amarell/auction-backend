let mongoose = require("mongoose");

let bidSchema = new mongoose.Schema({
  date_created: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  auction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
  },
  price: Number,
});

let Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
