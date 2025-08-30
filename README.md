# MMT-HTTP-AND-SETUP-PROJECT

## Node.js Express Backend Basic Project

### 📦 Khởi tạo dự án

```sh
node --version
v20.19.0

# Khởi tạo package.json mặc định
npm init -y

# Cài Express và Nodemon
npm install express
npm install --save-dev nodemon
```

### ⚙️ Cấu hình scripts trong package.json

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### 📝 index.js

```js
// ====================== IMPORTS ======================
const express = require('express');

const app = express();
const port = 3000;

// Middleware parse JSON
app.use(express.json());

// Route gốc
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ====================== START SERVER ======================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### 🚀 Chạy server

- Chạy bằng Node.js:

```sh
npm run start
```

- Chạy trong chế độ phát triển (tự reload khi thay đổi code):

```sh
npm run dev
```

- Mở trình duyệt vào: `http://localhost:3000` → sẽ thấy `Hello World!`

![](./images/HelloWorld.png)
