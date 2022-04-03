const router = require("express").Router();
let auctionController = require("../controllers/auctionController");

router
  .route("/auctions")
  .get(auctionController.getAuctions)
  .post(auctionController.postAuction);

module.exports = router;
