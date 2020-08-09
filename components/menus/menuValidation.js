const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = {
  body: Joi.object({
    name: Joi.string()
      .required(),
    description: Joi.string(),
    icon: Joi.string()
      .required(),
    type: Joi.string()
      .required(),
    url: Joi.string(),
    permissionId: Joi.string(),
  }),
};

const update = {
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    parent: Joi.string()
      .min(3)
      .max(255),
    level: Joi.number()
      .required(),
    icon: Joi.string()
      .min(3)
      .max(255),
    order: Joi.number()
      .required(),
    url: Joi.string()
      .min(3)
      .max(255),
  }),
};

module.exports = {
  create,
  update,
};
