const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const currentUser = require('../middlewares/currentUser');

module.exports = (app) => {
  // secure various HTTP headers with helmet
  app.use(helmet());

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // enable request file upload
  app.use(fileUpload());

  // enable cors
  app.use(cors());

  // parse current user
  app.use(currentUser);
};
