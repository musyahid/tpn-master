const express = require('express');
const { validate } = require('express-validation');
const UserController = require('./userController');
const {
  forgotPassword, register, updateProfile, activation, resetPassword,
} = require('./userValidation');

const router = express.Router();

router.post('/forgot-password', validate(forgotPassword, {}, { abortEarly: false }), UserController.forgot);

router.post('/activation', validate(activation, {}, { abortEarly: false }), UserController.activation);

router.post('/reset-password/:token', validate(resetPassword, {}, { abortEarly: false }), UserController.reset);

router.post('/register', validate(register), UserController.register);

router.put('/update-profile/:id', validate(updateProfile), UserController.updateProfile);


module.exports = router;
