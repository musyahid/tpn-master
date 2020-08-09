const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const login = {
  body: Joi.object({
    email: Joi.string()
      .required(),
    password: Joi.string()
      .required(),
  }),
};

const refreshToken = {
  body: Joi.object({
    refreshToken: Joi.string()
      .required(),
  }),
};

module.exports = {
  login,
  refreshToken,
};
