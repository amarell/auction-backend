const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("./../../validation");
const bcrypt = require("bcryptjs");
const jwt = require("./../utilities/jwt");
const { authorize } = require("../routes/protectedRoute");

module.exports.register = async (req, res) => {
  // validate data
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) {
    return res.status(400).json({
      error: "User's email is already in use!",
    });
  }

  // for now not hashing passwords
  // const salt = await bcrypt.genSalt();
  // const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.passwords,
  });

  user.save((err, savedUser) => {
    if (err) {
      res.status(400).json({
        status: "Something went wrong",
      });
    } else {
      res.status(200).json({
        user: savedUser._id,
      });
    }
  });
};

module.exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({
      error: "Email or password is wrong.",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).json({
      error: "Email or password is wrong.",
    });
  }

  const token = jwt.sign(user);

  res.header("authorization", token).status(200).json({
    status: "Success",
    token,
  });
};

module.exports.getUsers = (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json("Access denied");
  }
  User.find((err, users) => {
    if (err) {
      res.status(400).json({
        error: "Something went wrong!",
      });
    } else {
      res.status(200).json({
        status: "Sucess",
        data: users,
      });
    }
  });
};
