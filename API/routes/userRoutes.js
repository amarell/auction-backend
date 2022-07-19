const router = require("express").Router();
let userController = require("../controllers/userController");

router.route("/users").get(userController.getUsers);
router.route("/users/:id").get(userController.getUserById);
router.route("/users/:id").put(userController.updateUser);
router.route("/user-auctions/:user_id").get(userController.getUserAuctions);
router.route("/user-bids/:user_id").get(userController.getUserBids);
router.route("/won-auctions/:user_id").get(userController.getUsersWonAuctions);

module.exports = router;
