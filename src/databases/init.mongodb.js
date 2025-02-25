'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect.js');
const config = require('../configs/config.mongodb.js');

const {
    db: { host, name, port: dbPort },
} = config;

const connectString = `mongodb://${host}:${dbPort}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    //connect
    connect(type = 'mongodb') {
        mongoose
            .connect(connectString, {
                maxPoolSize: 50,
            })
            .then((_) => {
                console.log('Connect MongoDB successfully PRO', countConnect());
            })
            .catch((err) => {
                console.log(`Error connecting: ${err}`);
            });

        // DEV
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
            mongoose.set('strictQuery', false);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

// Create a singleton instance of the Database class
const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
