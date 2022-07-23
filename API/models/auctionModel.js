let mongoose = require("mongoose");

let auctionSchema = new mongoose.Schema({
  item_name: String,
  item_description: String,
  date_added: {
    type: Date,
    default: Date.now,
  },
  initial_price: Number,
  pictures: [
    {
      img_url: String,
      date_added: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date_ends: Date,
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expired: {
    type: Boolean,
    default: false,
  },
  won_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    default: "",
  },
});

let Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
