const morgan = require('morgan');
const express = require('express');
const app = express();
app.use(morgan('dev'));

const shoes = require('./routes/shoes');

/** middleware goes here */
app.use('/shoes', shoes);

module.exports = app;