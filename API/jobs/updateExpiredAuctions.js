var cron = require("node-cron");
const Auction = require("../models/auctionModel");
const Bid = require("../models/bidModel");
const mongoose = require("mongoose");

const updateExpiredAuctions = async () => {
  cron.schedule("*/5 * * * * *", async () => {
    const thisMoment = new Date();

    let auctions = await Auction.find({
      date_ends: {
        $lte: thisMoment,
      },
      expired: false,
    });

    if (auctions.length === 0) {
      console.log(
        new Date().toString() +
          " - Didn't find any auctions that expired since last update."
      );
      return;
    }

    let last_bid_id = null;

    auctions.forEach(async (auction) => {
      let bid_num = auction.bids.length;

      if (bid_num > 0) {
        last_bid_id = auction.bids[bid_num - 1];

        let last_bid = await Bid.findOne({
          _id: new mongoose.Types.ObjectId(last_bid_id),
        });

        if (last_bid) {
          console.log(last_bid);

          Auction.updateOne(
            {
              _id: new mongoose.Types.ObjectId(auction._id),
            },
            {
              won_by: new mongoose.Types.ObjectId(last_bid.created_by),
            },
            { new: true },
            (err, res) => {
              if (err) {
                console.log(err);
              }
              // console.log(res);
            }
          );
        }
      }
    });

    Auction.updateMany(
      {
        date_ends: {
          $lte: thisMoment,
        },
        expired: false,
      },
      { expired: true },
      { new: true },
      (err, _) => {
        if (err) {
          console.log("Something went wrong while updating expired auctions.");
        } else {
          console.log("Successfully updated expired auctions.");
        }
      }
    );
  });
};

module.exports = updateExpiredAuctions;
