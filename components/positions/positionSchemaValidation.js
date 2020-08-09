const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = Joi.object({
  position_id: Joi.number().min(3).max(255).required(),
  organization_structure_id:  Joi.string().min(3).max(255).required(),
  name:  Joi.string().min(3).max(255).required(),
  description:  Joi.string().min(3).max(255).required(),
  band:  Joi.string().min(3).max(255).required(),
  position_code:  Joi.string().min(3).max(255).required()
});

const update = Joi.object({
  position_id: Joi.number().min(3).max(255).required(),
  organization_structure_id:  Joi.string().min(3).max(255),
  name:  Joi.string().min(3).max(255).required(),
  description:  Joi.string().min(3).max(255),
  band:  Joi.string().min(3).max(255),
  position_code:  Joi.string().min(3).max(255)
});

module.exports = {
  create,
  update,
};