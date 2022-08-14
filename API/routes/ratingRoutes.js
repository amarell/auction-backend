const router = require("express").Router();
let ratingController = require("../controllers/ratingController");

router
  .route("/rating/:id")
  .post(ratingController.postRating)
  .get(ratingController.getAverageUserRating);

router.route("/canLeaveRating/:id").get(ratingController.canLeaveRating);
router
  .route("/usersSellerRating/:id")
  .get(ratingController.getUsersSellerRating);

module.exports = router;
