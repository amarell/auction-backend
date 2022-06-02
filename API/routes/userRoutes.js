const router = require("express").Router();
let userController = require("../controllers/userController");

router.route("/users").get(userController.getUsers);
router.route("/users/:id").get(userController.getUserById);
router.route("/users/:id").put(userController.updateUser);
router.route("/user-auctions/:user_id").get(userController.getUserAuctions);

module.exports = router;
