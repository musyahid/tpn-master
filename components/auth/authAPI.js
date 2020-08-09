const express = require('express');
const { validate } = require('express-validation');
const authController = require('./authController');
const { login, refreshToken } = require('./authValidation');

const router = express.Router();

router.post('/login', validate(login), authController.login);

router.post('/token', validate(refreshToken), authController.refToken);

module.exports = router;
