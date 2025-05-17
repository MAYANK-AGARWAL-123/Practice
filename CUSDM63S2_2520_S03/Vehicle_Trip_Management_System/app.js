const express = require('express');
const connectDB = require('./config/db');
const vehicleRoutes = require('./routes/vehicleRoutes');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/vehicles', vehicleRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});