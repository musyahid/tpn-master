const Joi = require('@hapi/joi');

// TODO : Define validation request input here
const create = {
  body: Joi.object({
    fullname: Joi.string()
      .required(),
    nik: Joi.string()
      .required(),
    role: Joi.string(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required(),
    type: Joi.string()
      .valid('telkom', 'mitra'),
    jobPosition: Joi.string(),
    phoneNumber: Joi.string(),
    country: Joi.string(),
    avatar: Joi.string(),
  }),
};

const update = {
  body: Joi.object({
    fullname: Joi.string(),
    role: Joi.object({
      name: Joi.string(),
      ref_id: Joi.string(),
    }),
    email: Joi.string().email(),
    type: Joi.string(),
    job_position: Joi.string(),
    mobile_number: Joi.string(),
    country: Joi.string(),
    avatar: Joi.string(),
  }),
};

const updateProfile = {
  body: Joi.object({
    fullname: Joi.string(),
    working_at: Joi.string(),
    email: Joi.string().email(),
    mobile_number: Joi.string(),
    country: Joi.string(),
    linked_in: Joi.string(),
    facebook: Joi.string(),
    twitter: Joi.string()
  }),
};

const register = {
  body: Joi.object({
    fullname: Joi.string()
      .required(),
    email: Joi.string()
      .required()
      .email(),
    phone_number: Joi.string()
      .required(),
    password: Joi.string()
      .required(),
    country: Joi.string()
      .required(),
  }),
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
  }),
};

const changePassword = {
  body: Joi.object({
    password: Joi.string()
      .min(3)
      .max(255)
      .required(),
  }),
};

const activation = {
  query: Joi.object({
    token: Joi.string()
      .required(),
    email: Joi.string()
      .email()
      .required(),
  }),
};

const resetPassword = {
  body: Joi.object({
    password: Joi.string()
      .required(),
  }),
  query: Joi.object({
    email: Joi.string()
      .required()
      .email(),
  }),
};
module.exports = {
  create,
  update,
  updateProfile,
  forgotPassword,
  register,
  changePassword,
  activation,
  resetPassword,
};
