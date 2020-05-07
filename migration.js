const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite');

db.run(
    'DROP TABLE IF EXISTS Artist', 
    (err) => {
        if(err) {
            throw err;
        } else {
            db.run(
                'CREATE TABLE IF NOT EXISTS `Artist` ( ' +
                    '`id` INTEGER NOT NULL, ' +
                    '`name` TEXT NOT NULL, ' +
                    '`date_of_birth` TEXT NOT NULL, ' +
                    '`biography` TEXT NOT NULL, ' +
                    '`is_currently_employed` INTEGER NOT NULL DEFAULT 1, ' +
                    'PRIMARY KEY(`id`) )',
                (err) => {
                    if(err) {
                        throw err;
                    };
                }
            );
        };
    }
);