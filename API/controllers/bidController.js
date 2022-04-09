const Bid = require("../models/bidModel");
const Auction = require("../models/auctionModel");
const { authorize } = require("../routes/protectedRoute");
const jwt = require("../utilities/jwt");

const findAuctionAndAddBidToIt = async (id, bid) => {
  const auction = await Auction.findById(id);

  const bids = auction.bids;
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
    price: req.body.price,
    created_by: token.uid,
    auction_id: req.body.auction_id,
  });

  const savedBid = await bid.save();
  const auction = await findAuctionAndAddBidToIt(req.body.auction_id, savedBid);

  if (auction) {
    res.json({
      auction,
    });
  }
};
