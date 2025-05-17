const express = require('express');
const connectDB = require('./db');
const tasks = require('./routes/tasks');
const bodyParser = require('body-parser');

connectDB();

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/tasks', tasks);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});