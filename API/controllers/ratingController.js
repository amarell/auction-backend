const Rating = require("../models/ratingModel");
const jwt = require("../utilities/jwt");
const mongoose = require("mongoose");
const { authorize } = require("../routes/protectedRoute");

module.exports.postRating = async (req, res) => {
  let auth = authorize(req);
  if (auth === false) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = jwt.verify(req.headers.authorization);

  const rating_for_user = req.params.id;

  const rating = new Rating({
    rating: parseInt(req.body.rating),
    created_by: token.uid,
    created_for: rating_for_user,
  });

  rating.save((err, rating) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong",
      });
    } else {
      return res.status(200).json({
        rating,
      });
    }
  });
};

module.exports.getAverageUserRating = async (req, res) => {
  let user_id = req.params.id;

  let pipeline = [
    {
      $group: {
        _id: "$created_for",
        avgRating: {
          $avg: "$rating",
        },
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user_id),
      },
    },
  ];

  try {
    const averageRating = await Rating.aggregate(pipeline);

    if (averageRating && averageRating.length > 0) {
      return res.status(200).json({
        averageRating,
      });
    } else {
      return res.status(400).json({
        error: "Ratings for this user don't exist.",
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: "Something went wrong!",
    });
  }
};
