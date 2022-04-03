let mongoose = require("mongoose");

let auctionSchema = new mongoose.Schema({
  item_name: String,
  item_description: String,
  date_added: {
    type: Date,
    default: Date.now,
  },
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
});

let Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
