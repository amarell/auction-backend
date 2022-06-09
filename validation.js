// Validation
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

const newAuctionValidation = (data) => {
  const schema = Joi.object({
    created_by: Joi.string().required(),
    item_name: Joi.string().required(),
    item_description: Joi.string().required(),
    date_ends: Joi.string().required(),
    initial_price: Joi.string().required(),
    pictures: Joi.array(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.newAuctionValidation = newAuctionValidation;
