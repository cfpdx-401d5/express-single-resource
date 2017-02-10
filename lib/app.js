const express = require('express');
const app = express();
const modern = require('./routes/modern');
const morgan = require('morgan');
app.use(morgan('dev'));

const path = require('path');
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.use('/modern', modern)

module.exports = app;