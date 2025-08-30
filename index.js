// ====================== IMPORTS ======================
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: [`http://localhost:${port}`, 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


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

