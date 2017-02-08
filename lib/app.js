const express = require('express');
const app = express();
const objectId = require('mongodb').objectId

const connection = require('./connection');

const path = require('path');
const publicPath = path.join(_dirname, '../public');