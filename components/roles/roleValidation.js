const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = {
  body: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    menus: Joi.array().items(Joi.object()),
    permissions: Joi.array().items(Joi.string()),
    created_by: Joi.string().min(3).max(255).required(),
  }),
};

const update = {
  body: Joi.object({
    name: Joi.string().min(3).max(255),
    created_by: Joi.string().min(3).max(255),
  }),
};

module.exports = {
  create,
  update,
};
