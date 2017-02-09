const express = require('express');
const app = express();
const unicorns = require('./routes/unicorns');
const morgan = require('morgan');
app.use(morgan('dev'));

const path = require('path');
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.use('/unicorns', unicorns);

module.exports = app;