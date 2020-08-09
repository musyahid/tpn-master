const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = {
  body: Joi.object({
    _id: Joi.string()
      .min(3)
      .max(255),
    name: Joi.string()
      .min(3)
      .max(255),
    parent: Joi.string()
      .min(3)
      .max(255),
  }),
};
const update = {
  body: Joi.object({
    _id: Joi.string()
      .min(3)
      .max(255),
    name: Joi.string()
      .min(3)
      .max(255),
    parent: Joi.string()
      .min(3)
      .max(255),
  }),
};


module.exports = {
  create,
  update,
};
