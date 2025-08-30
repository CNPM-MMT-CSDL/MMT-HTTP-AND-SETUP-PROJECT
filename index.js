// ====================== IMPORTS ======================
const express = require('express');


const app = express();
const port = 3000;

app.use(express.json());

// Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});


// ====================== START SERVER ======================
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

