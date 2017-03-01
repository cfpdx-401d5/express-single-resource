const express = require('express');
const app = express();
const dogs = require('./routes/dogs.routes');
const morgan = require('morgan');
app.use(morgan('dev'));

// const path = require('path');
// const publicPath = path.join(__dirname, '../public');
// app.use(express.static(publicPath));

app.use('/dogs', dogs);

module.exports = app;