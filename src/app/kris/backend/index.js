const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Dữ liệu user lưu tạm trong RAM
let users = [];

// Lấy danh sách user
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Thêm user mới
app.post('/api/users', (req, res) => {
  const user = req.body;
  user.id = Date.now(); // Tạo id đơn giản
  users.push(user);
  res.status(201).json(user);
});

// Xóa user theo id
app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);
  res.status(204).end();
});

// Sửa thông tin user
app.put('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const updatedUser = req.body;
  users = users.map(u => (u.id === id ? { ...u, ...updatedUser } : u));
  res.json(updatedUser);
});

app.listen(PORT, () => {
  console.log(`User Manager API running at http://localhost:${PORT}`);
});
