const Bid = require("../models/bidModel");
const Auction = require("../models/auctionModel");
const { authorize } = require("../routes/protectedRoute");
const jwt = require("../utilities/jwt");
const mongoose = require("mongoose");

const findAuctionAndAddBidToIt = async (id, bid) => {
  const auction = await Auction.aggregate([
    [
      {
        $lookup: {
          from: "bids",
          localField: "bids",
          foreignField: "_id",
          as: "bids",
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
    ],
  ]).limit(1);

  const bids = auction[0].bids;

  if (bids.length === 0) {
    if (bid.price <= auction.initial_price) {
      return {
        error: "Your bid has to be greater than the initial price",
      };
    }
  } else if (bid.price <= bids[bids.length - 1].price) {
    return {
      error: "Your bid has to be greater than the current price",
    };
  }

  bids.push(bid);

  const update = await Auction.findByIdAndUpdate(
    id,
    { bids: bids },
    { new: true }
  );

  return update;
};

module.exports.postBid = async (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json("Access denied");
  }

  const token = jwt.verify(req.headers.authorization);

  const bid = new Bid({
    price: parseFloat(req.body.price),
    created_by: token.uid,
    auction_id: req.body.auction_id,
  });

  const savedBid = await bid.save();
  const response = await findAuctionAndAddBidToIt(
    req.body.auction_id,
    savedBid
  );

  if (response.error) {
    return res.status(400).json({
      error: response.error,
    });
  }

  if (response) {
    return res.json({
      response,
    });
  }
};
