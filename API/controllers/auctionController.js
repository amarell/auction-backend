const Auction = require("../models/auctionModel");
const jwt = require("jsonwebtoken");
const { authorize } = require("../routes/protectedRoute");
const { newAuctionValidation } = require("./../../validation");

module.exports.getAuctions = async (req, res) => {
  try {
    let searchQuery = req.query.search;
    let skip = req.query.skip;
    let limit = req.query.limit;
    let sort;
    let direction;

    !req.query.sort ? (sort = "created_at") : (sort = req.query.sort);
    !req.query.direction ? (direction = -1) : (direction = req.query.direction);

    // TODO: add sorting by the number of bids and other params

    const auctions = await Auction.aggregate([
      [
        {
          $lookup: {
            from: "bids",
            localField: "bids",
            foreignField: "_id",
            as: "bids",
          },
        },
        {
          $match: {
            $or: [
              {
                item_name: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                item_description: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $skip: parseInt(skip, 10),
        },
        {
          $limit: parseInt(limit, 10),
        },
      ],
    ]).sort({ sort: direction });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports.getActiveAuctions = async (req, res) => {
  try {
    let searchQuery = req.query.search;
    let skip = req.query.skip;
    let limit = req.query.limit;

    let sort = {};

    !req.query.sort
      ? (sort.field = "created_at")
      : (sort.field = req.query.sort);

    !req.query.direction
      ? (sort.direction = -1)
      : (sort.direction = parseInt(req.query.direction));

    let sortQuery = {};

    let $match = { date_ends: { $gt: new Date() } };

    if (req.query.category) {
      $match.category = req.query.category;
    }

    sortQuery[sort.field] = sort.direction;

    // TODO: add sorting by the number of bids and other params

    const auctions = await Auction.aggregate([
      [
        {
          $lookup: {
            from: "bids",
            localField: "bids",
            foreignField: "_id",
            as: "bids",
          },
        },
        {
          $match,
        },
        {
          $match: {
            $or: [
              {
                item_name: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
              {
                item_description: {
                  $regex: searchQuery,
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $addFields: {
            bid_count: {
              $size: {
                $ifNull: ["$bids", []],
              },
            },
          },
        },
        {
          $addFields: {
            last_bid: {
              $cond: {
                if: {
                  $eq: [[], "$bids"],
                },
                then: {
                  price: "$initial_price",
                },
                else: {
                  $last: "$bids",
                },
              },
            },
          },
        },
        {
          $addFields: {
            current_price: "$last_bid.price",
          },
        },
        {
          $skip: parseInt(skip, 10),
        },
        {
          $limit: parseInt(limit, 10),
        },
        {
          $sort: sortQuery,
        },
      ],
    ]);

    res.status(200).json(auctions);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports.getAuctionById = async (req, res) => {
  let id = req.params.id;
  try {
    const auction = await Auction.findById(id).populate("bids");
    if (auction === null) {
      return res.status(400).json({
        error: "No such auction!",
      });
    }
    return res.status(200).json({
      data: auction,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong!",
    });
  }
};

module.exports.postAuction = (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json({ error: "Access denied" });
  }

  const { error } = newAuctionValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const auction = new Auction({
    item_name: req.body.item_name,
    item_description: req.body.item_description,
    date_ends: req.body.date_ends,
    initial_price: req.body.initial_price,
    created_by: req.body.created_by,
    pictures: req.body.pictures,
    category: req.body.category,
  });

  const savedAuction = auction.save((err, savedAuction) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    } else {
      res.status(200).json({
        data: savedAuction,
      });
    }
  });
};

module.exports.updateAuction = async (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json({ error: "Access denied" });
  }

  if (req.body.date_ends) {
    return res.status(400).json({ error: "You can't change the ending time" });
  }

  let id = req.params.id;

  try {
    let auction = await Auction.findById(id);
    if (auction === null) {
      res.status(400).json({ error: "No such auction!" });
    } else {
      if (
        auction.created_by.toString() !==
        jwt.decode(req.headers.authorization).uid
      ) {
        return res.status(401).json({ error: "Access denied" });
      } else {
        Auction.findByIdAndUpdate(
          id,
          req.body,
          { new: true },
          (err, updatedAuction) => {
            if (err) {
              return res.status(400).json({ error: "Something went wrong" });
            } else {
              return res.status(200).json({ data: updatedAuction });
            }
          }
        );
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};
