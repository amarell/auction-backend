const router = require("express").Router();
let ratingController = require("../controllers/ratingController");

router
  .route("/rating/:id")
  .post(ratingController.postRating)
  .get(ratingController.getAverageUserRating);

module.exports = router;
