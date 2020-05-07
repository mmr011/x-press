const express = require('express');
const artistApi = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistApi.param('artistId', (req, res, next, artistId) => {
    db.get(
        'SELECT * FROM Artist WHERE id = $id', 
        {
            $id: artistId
        }, 
        (err, artist) => {
            if(err) {
                next(err);
            } else if(artist) {
                req.artist = artist;
                next();
            } else {
                res.sendStatus(404);
            };
        }
    );
});

artistApi.get('/', (req, res, next) => {
    db.all(
        'SELECT * FROM Artist WHERE is_currently_employed = 1', 
        (err, artists) => {
            if(err) {
                next(err);
            } else {
                res.status(200).json({ artists: artists });
            };
        }
    );
});

artistApi.get('/:artistId', (req, res, next) => {
    res.status(200).json({ artist: req.artist });
});

artistApi.post('/', (req, res, next) => {
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;

    if(!name || !dateOfBirth || !biography) {
        return res.sendStatus(400);
    };

    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1; 

    db.run(
        'INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)', 
        {
            $name: name, 
            $dateOfBirth: dateOfBirth, 
            $biography: biography, 
            $isCurrentlyEmployed: isCurrentlyEmployed
        }, 
        function(err) {
            if(err) {
                next(err); 
            } else {
                db.get(
                    `SELECT * FROM Artist WHERE id = ${this.lastID}`, 
                    (err, newArtist) => {
                        if(err) {
                            next(err);
                        } else {
                            res.status(201).json({ artist: newArtist });
                        };
                    }
                );
            };
        }
    );
});

artistApi.put('/:artistId', (req, res, next) => {
    const name = req.body.artist.name;
    const dateOfBirth = req.body.artist.dateOfBirth;
    const biography = req.body.artist.biography;

    if(!name || !dateOfBirth || !biography) {
        return res.sendStatus(400);
    };

    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1; 

    db.run(
        'UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE Artist.id = $artistId',
        {
            $name: name, 
            $dateOfBirth: dateOfBirth,
            $biography: biography,
            $isCurrentlyEmployed: isCurrentlyEmployed, 
            $artistId: req.params.artistId
        }, 
        (err) => {
            if(err) {
                next(err);
            } else {
                db.get(
                    `SELECT * FROM Artist WHERE id = ${req.params.artistId}`, 
                    (err, updatedArtist) => {
                        if(err) {
                            next(err);
                        } else {
                            res.status(200).json({ artist: updatedArtist });
                        };
                    }
                );
            };
        }
    );
});

artistApi.delete('/:artistId', (req, res, next) => {
    db.run(
        'UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId',
        {
            $artistId: req.params.artistId
        }, 
        (err) => {
            if(err) {
                next(err);
            } else {
                db.get(
                    `SELECT * FROM Artist WHERE id = ${req.params.artistId}`, 
                    (err, unemployedArtist) => {
                        if(err) {
                            next(err);
                        } else {
                            res.status(200).json({ artist: unemployedArtist });
                        };
                    }
                );
            };
        }
    );
});

module.exports = artistApi; 