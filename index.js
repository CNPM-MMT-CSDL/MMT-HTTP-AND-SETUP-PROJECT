// ====================== IMPORTS ======================
const express = require('express');
const path = require('path');
const cors = require('cors');
const winston = require('winston');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

// ====================== MIDDLEWARE ======================
app.use(express.json());
app.use(cors({
    origin: [`http://localhost:${port}`, 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(cookieParser());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: false, secure: false, maxAge: 1000 * 60 * 60 }
}));

// ====================== AUTH MIDDLEWARE ======================
function requireLogin(req, res, next) {
    if (req.session && req.session.user) return next();
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
}

// ====================== FAKE DB ======================
let subjects = [
    { id: 1, name: 'Toán' },
    { id: 2, name: 'Văn' },
    { id: 3, name: 'Anh' },
];
let ID = 4;

const USER = { username: 'admin', password: '123' };

// ====================== LOG MIDDLEWARE ======================
app.use((req, res, next) => {
    logger.info(`==== API CALL ====`);
    logger.info(`Time: ${new Date().toISOString()}`);
    logger.info(`Method: ${req.method}`);
    logger.info(`URL: ${req.originalUrl}`);
    logger.info(`Session data: ${JSON.stringify(req.session)}`);
    logger.info(`Cookies: ${JSON.stringify(req.cookies)}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    logger.info(`Current subjects: ${JSON.stringify(subjects)}`);
    logger.info(`=================`);
    next();
});

// ====================== AUTH ROUTES ======================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        req.session.user = { username };
        return res.json({ message: "Đăng nhập thành công" });
    }
    res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: "Đăng xuất thành công" });
    });
});


// ====================== SUBJECTS ROUTES ======================
app.get('/api/subjects', requireLogin, (req, res) => {
    res.json(subjects);
});

app.post('/api/subjects', requireLogin, (req, res) => {
    const newSub = { id: ID++, name: req.body.name };
    subjects.push(newSub);
    res.status(201).json(newSub);
});

app.put('/api/subjects/:id', requireLogin, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = subjects.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    subjects[idx].name = req.body.name;
    res.json(subjects[idx]);
});

app.delete('/api/subjects/:id', requireLogin, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = subjects.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    subjects = subjects.filter(s => s.id !== id);
    res.json({ success: true });
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

