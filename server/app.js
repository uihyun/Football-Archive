const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
const routes = require('./routes/index');

// Serve static assets
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, '../img')));

app.use(morgan('dev'));
app.use('/', routes);

module.exports = app;
