const express = require('express');
const api = express.Router();
const artistApi = require('./artist');
const seriesApi = require('./series');

api.use('/artists', artistApi);
api.use('/series', seriesApi);

module.exports = api; 