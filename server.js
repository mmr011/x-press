const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const api = require('./api/api')
const app = express(); 

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(errorhandler());

app.use('/api', api);

const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

module.exports = app; 