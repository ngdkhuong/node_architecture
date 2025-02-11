'use strict';

import mongoose from 'mongoose';

const connectString = 'mongodb://localhost:27017/shopCrypto';

const connectDB = async () => {
    try {
        await mongoose.connect(connectString);
        console.log('Connect MongoDB successfully');
    } catch (err) {
        console.log(`Error connecting: ${err}`);
    }
};

// DEV
if (1 === 1) {
    // In case of dev, use local db
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

export default connectDB;
