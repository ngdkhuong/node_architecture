'use strict';

import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
const _SECONDS = 5000;

// count connections
export const countConnect = () => {
    const numConnections = mongoose.connections.length;

    console.log(`Number of connections: ${numConnections}`);
};

// check over load
export const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // TODO: example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active Connections: ${numConnections}, Memory usage: ${memoryUsage / 1024 / 1024}MB`);

        if (numConnections > maxConnections) {
            console.error(`Overload: ${numConnections} connections. Restarting the server...`);
        }
    }, _SECONDS); // monitor every 5 seconds
};
