const router = require("express").Router();
let bidController = require("../controllers/bidController");

router.route("/bids").post(bidController.postBid);

module.exports = router;
