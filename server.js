import app from './src/app.js';
import config from './src/configs/config.mongodb.js';

const {
    app: { port },
} = config;

const PORT = port || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'));
});
