import express from 'express';
import morgan from 'morgan';
import helmet from "helmet"
import compression from 'compression';
const app = express();

// Middleware
// app.use(morgan("dev"))
app.use(morgan("combined"))
// morgan("common")
// morgan("test")
// morgan("tiny")
// morgan("short")
app.use(helmet()) 
app.use(compression()) // giam memary

// routes
app.get('/', (req,res, next) => {
    const testMemories = "Hello World"

    return res.status(200).json({
        message: "Welcome to the API server",
        metadata: testMemories.repeat(10000)
    })
})

export default app;