const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
  { id: 3, name: "Bob Smith", email: "bob@example.com" }
];

app.get('/users/get', (req, res) => {
  try {
    res.status(200).json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/users/list', (req, res) => {
  try {
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('GET /users/get - Get single user');
  console.log('GET /users/list - Get all users');
});