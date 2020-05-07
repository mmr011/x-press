const express = require('express');
const sqlite3 = require('sqlite3');
const seriesApi = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

seriesApi.param('seriesId', (req, res, next, seriesId) => {
    db.get(
        'SELECT * FROM Series WHERE id = $id', 
        {
            $id: seriesId
        }, 
        (err, series) => {
            if(err) {
                next(err);
            } else if(series) {
                req.series = series;
                next()
            } else {
                res.sendStatus(404);
            };
        }
    );
});

seriesApi.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Series',
        (err, series) => {
            if(err) {
                next(err);
            } else {
                res.status(200).json({ series: series });
            };
        }
    );
});

seriesApi.get('/:seriesId', (req, res, next) => {
   res.status(200).json({ series: req.series }); 
});

seriesApi.post('/:seriesId', (req, res, next) => {
    const name = req.body.series.name;
    const description = req.body.series.description;

    if(!name || !description) {
        return res.sendStatus(400);
    };

    db.run(
        'INSERT INTO Series (name, description) VALUES ($name, $description)', 
        {
            $name: name, 
            $description: description
        }, 
        function(err) {
            if(err) {
                next(err);
            } else {
                db.get(
                    `SELECT * FROM Series WHERE id = ${this.lastID}`, 
                    (err, newSeries) => {
                        if(err) {
                            next(err);
                        } else {
                            res.status(201).json({ series: newSeries });
                        };
                    }
                );
            };
        }
    );
});

module.exports = seriesApi;