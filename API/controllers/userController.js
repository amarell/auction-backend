const User = require("../models/userModel");
const Auction = require("../models/auctionModel");
const Bid = require("../models/bidModel");
const { registerValidation, loginValidation } = require("./../../validation");
const bcrypt = require("bcryptjs");
const jwt = require("./../utilities/jwt");
const { authorize } = require("../routes/protectedRoute");
const mongoose = require("mongoose");

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

  // for now not hashing passwords //
  // const salt = await bcrypt.genSalt();
  // const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, savedUser) => {
    if (err) {
      res.status(400).json({
        error: "Something went wrong",
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

  // const validPassword = await bcrypt.compare(req.body.password, user.password);
  const validPassword = req.body.password === user.password;

  if (!validPassword) {
    return res.status(400).json({
      error: "Email or password is wrong.",
    });
  }

  const token = jwt.sign(user);

  res.header("authorization", token).status(200).json({
    token,
  });
};

module.exports.getUsers = (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json({ error: "Access Denied!" });
  }
  User.find((err, users) => {
    if (err) {
      res.status(400).json({
        error: "Something went wrong!",
      });
    } else {
      res.status(200).json({
        data: users,
      });
    }
  });
};

module.exports.getUserById = (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      res.status(400).json({
        error: "Something went wrong!",
      });
    } else if (user === null) {
      return res.status(400).json({
        error: "No such user!",
      });
    } else {
      const keys = [
        "_id",
        "first_name",
        "last_name",
        "username",
        "profile_picture",
        "bio",
        "email",
        "role",
        "created_at",
      ];

      let result = {};
      for (const key of keys) {
        result[key] = user[key];
      }

      return res.status(200).json({
        data: result,
      });
    }
  });
};

module.exports.updateUser = async (req, res) => {
  let id = req.params.id;
  let auth = authorize(req, id, req.headers.authorization);
  if (auth === false) {
    return res.status(401).json({ error: "Access Denied!" });
  }

  User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
    if (err) {
      res.status(400).json({
        error: "Something went wrong!",
      });
    } else if (user === null) {
      res.status(400).json({
        error: "User not found!",
      });
    } else {
      const keys = [
        "_id",
        "first_name",
        "last_name",
        "username",
        "profile_picture",
        "bio",
        "email",
        "role",
        "created_at",
      ];

      let result = {};
      for (const key of keys) {
        result[key] = user[key];
      }

      res.status(200).json({
        updatedUser: result,
      });
    }
  });
};

module.exports.getUserAuctions = async (req, res) => {
  let id = req.params.user_id;
  let pipeline = [
    {
      $match: {
        created_by: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "bids",
        localField: "bids",
        foreignField: "_id",
        as: "bids",
      },
    },
    {
      $sort: {
        date_ends: -1,
      },
    },
  ];

  try {
    let auctions = await Auction.aggregate(pipeline);

    res.status(200).json({
      auctions,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports.getUserBids = async (req, res) => {
  let id = req.params.user_id;

  let pipeline = [
    {
      $match: {
        created_by: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "auctions",
        localField: "auction_id",
        foreignField: "_id",
        as: "auction",
      },
    },
    {
      $unwind: {
        path: "$auction",
      },
    },
    {
      $sort: {
        date_created: -1,
      },
    },
  ];

  try {
    let bids = await Bid.aggregate(pipeline);

    res.status(200).json({
      bids,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
