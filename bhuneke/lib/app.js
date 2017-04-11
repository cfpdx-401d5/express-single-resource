const express = require('express');
const app = express();
const trees = require('./routes/trees');
const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/trees', trees);


module.exports = app;