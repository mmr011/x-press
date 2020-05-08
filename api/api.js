const express = require('express');
const api = express.Router();
const artistRouter = require('./artist');
const seriesRouter = require('./series');

api.use('/artists', artistRouter);
api.use('/series', seriesRouter);

module.exports = api; 