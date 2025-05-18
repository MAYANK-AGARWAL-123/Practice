const express = require('express');
const connectDB = require('./config/db');
const rentalRoutes = require('./routes/rentalRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', rentalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});