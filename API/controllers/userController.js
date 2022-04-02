const e = require("express");
const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("./../../validation");
const bcrypt = require("bcryptjs");

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

  // hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  const savedUser = user.save((err, savedUser) => {
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
      error: "Email is wrong.",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).json({
      error: "Password is wrong.",
    });
  }

  res.status(200).json({
    status: "Success",
  });
};

module.exports.getUsers = (req, res) => {
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
