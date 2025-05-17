const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const libraryRoutes = require('./routes/library.routes');

connectDB();

const app = express();

app.use(bodyParser.json());

app.use('/library', libraryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});