const Bid = require("../models/bidModel");
const { authorize } = require("../routes/protectedRoute");
const jwt = require("../utilities/jwt");

// module.exports.getBidsForSpecificAuction = (req, res) => {};

module.exports.postBid = (req, res) => {
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

  const savedBid = bid.save((err, savedBid) => {
    if (err) {
      res.status(400).json({
        status: "Something went wrong",
      });
    } else {
      res.status(200).json({
        data: savedBid,
      });
    }
  });
};
