const router = require("express").Router();
let userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.json({
    message: "API is working",
    version: "1.0.0",
  });
});

router.route("/register").post(userController.register);

router.route("/users").get(userController.getUsers);

module.exports = router;
