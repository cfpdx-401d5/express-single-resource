const express = require('express');
const app = express();
const tools = require('./routes/tool-routes');

app.use('/', tools);
app.use('/tools', tools);

module.exports = app;