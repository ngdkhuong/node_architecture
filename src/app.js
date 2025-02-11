import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import instanceMongodb from './databases/init.mongodb.js';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();
const app = express();

// Middleware
// app.use(morgan("dev"))
app.use(morgan('combined'));
// morgan("common")
// morgan("test")
// morgan("tiny")
// morgan("short")
app.use(helmet());
app.use(compression()); // giam memary

// db
instanceMongodb;
import { checkOverLoad } from './helpers/check.connect.js';

// checkOverLoad(); // kiem tra co load qua tai nen tat app

// routes
app.use('/', router);

export default app;
