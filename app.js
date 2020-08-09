const express = require('express');

const app = express();

require('dotenv').config();
require('./startup/initialize')(app);
require('./startup/routes')(app);
require('./startup/db')();


process.on('uncaughtException', (err) => {
  console.log(err);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
});

module.exports = app;
