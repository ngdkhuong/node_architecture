'use strict';

import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect.js';
import config from '../configs/config.mongodb.js';

const {
    db: { host, name, port: dbPort },
} = config;

const connectString = `mongodb://${host}:${dbPort}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    //connect
    connect() {
        mongoose
            .connect(connectString, {
                maxPoolSize: 100,
            })
            .then(() => {
                console.log('Connect MongoDB successfully PRO', countConnect());
            })
            .catch((err) => {
                console.log(`Error connecting: ${err}`);
            });

        // DEV
        if (1 === 1) {
            // In case of dev, use local db
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
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

export default instanceMongodb;
