const express = require('express');
const api = express.Router();
const artistApi = require('./artist');

api.use('/artists', artistApi);

module.exports = api; 