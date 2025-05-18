const express = require('express');
const connectDB = require('./config/db');
const libraryRoutes = require('./routes/libraryRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', libraryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});