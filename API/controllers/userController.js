const e = require("express");
const User = require("../models/userModel");
const { registerValidation } = require("./../../validation");

module.exports.register = async (req, res) => {
  // validate data
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) {
    return res.status(400).json({
      error: " User's email is already in use!",
    });
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  const savedUser = user.save((err, savedUser) => {
    if (err) {
      res.status(400).json({
        status: "Something went wrong",
      });
    } else {
      res.status(200).json({
        data: savedUser,
      });
    }
  });
};

module.exports.getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.json({
        status: "Something went wrong",
      });
    } else {
      res.json({
        code: 200,
        data: users,
      });
    }
  });
};
