const Auction = require("../models/auctionModel");
const { authorize } = require("../routes/protectedRoute");

module.exports.getAuctions = (req, res) => {
  Auction.find((err, auctions) => {
    if (err) {
      res.status(400).json({
        error: "Something went wrong!",
      });
    } else {
      res.status(200).json({
        status: "Sucess",
        data: auctions,
      });
    }
  });
};

module.exports.postAuction = (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json("Access denied");
  }

  const auction = new Auction({
    item_name: req.body.item_name,
    item_description: req.body.item_description,
    date_ends: req.body.date_ends,
  });

  const savedAuction = auction.save((err, savedAuction) => {
    if (err) {
      res.status(400).json({
        status: "Something went wrong",
      });
    } else {
      res.status(200).json({
        data: savedAuction,
      });
    }
  });
};
