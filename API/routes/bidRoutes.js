const router = require("express").Router();
let bidController = require("../controllers/bidController");

router.route("/bids").post(bidController.postBid);

router.route("/bid/:id").get(bidController.getBid);

module.exports = router;
