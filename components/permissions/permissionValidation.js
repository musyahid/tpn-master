const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = {
  body: Joi.object({
    _id: Joi.string()
      .min(3)
      .max(255)
      .required(),
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    description: Joi.string()
      .min(3)
      .max(255)
      .required(),
    isMenu: Joi.boolean()
      .required(),
    url: Joi.string()
      .min(3)
      .max(255)
      .required(),
    editable: Joi.boolean()
      .required(),
  }),
};

const update = {
  body: Joi.object({
    code: Joi.string()
      .min(3)
      .max(255)
      .required(),
    name: Joi.string()
      .min(3)
      .max(255),
    description: Joi.string()
      .min(3)
      .max(255),
    level_access: Joi.number()
      .min(3)
      .max(255),
  }),
};

module.exports = {
  create,
  update,
};
