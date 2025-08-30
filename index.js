// ====================== IMPORTS ======================
const express = require('express');
const path = require('path');
const cors = require('cors');
const winston = require('winston');
const app = express();
const port = 3000;

// ======================= LOG =================
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(__dirname, 'app.log') })
    ]
});

app.use(express.json());
app.use(cors({
    origin: [`http://localhost:${port}`, 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ====================== LOG MIDDLEWARE ======================
app.use((req, res, next) => {
    logger.info(`==== API CALL ====`);
    logger.info(`Time: ${new Date().toISOString()}`);
    logger.info(`Method: ${req.method}`);
    logger.info(`URL: ${req.originalUrl}`);
    logger.info(`=================`);
    next();
});

// Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello World!' });
});

// ====================== REACT BUILD (SPA) ======================
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// ====================== START SERVER ======================
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

