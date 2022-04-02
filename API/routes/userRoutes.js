const router = require("express").Router();
let userController = require("../controllers/userController");

router.route("/users").get(userController.getUsers);

module.exports = router;
