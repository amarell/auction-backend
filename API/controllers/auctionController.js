const Auction = require("../models/auctionModel");
const { authorize } = require("../routes/protectedRoute");

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
    res.status(400).json(error);
  }
};

module.exports.getActiveAuctions = async (req, res) => {
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
            date_ends: { $gt: new Date() },
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
    res.status(400).json(error);
  }
};

module.exports.postAuction = (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json("Access denied");
  }

  const auction = new Auction({
    item_name: req.body.item_name,
    item_description: req.body.item_description,
    date_ends: req.body.date_ends,
    initial_price: req.body.initial_price,
  });

  const savedAuction = auction.save((err, savedAuction) => {
    if (err) {
      res.status(400).json({
        status: "Something went wrong",
      });
    } else {
      res.status(200).json({
        data: savedAuction,
      });
    }
  });
};
