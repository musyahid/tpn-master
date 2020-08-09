const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = {
  body: Joi.object({
    _id: Joi.string()
      .max(255)
      .required(),
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    description: Joi.string()
      .required(),
    editable: Joi.boolean()
      .required(),
    permissionId: Joi.array()
      .max(255)
      .required(),
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
    description: Joi.string(),
    editable: Joi.boolean(),
    permissionId: Joi.array()
      .max(255),
  }),
};

module.exports = {
  create,
  update,
};
