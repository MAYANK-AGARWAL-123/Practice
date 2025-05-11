const express = require('express');
const app = express();
const adminRouter = require('./routes/adminRoutes');
const readerRouter = require('./routes/readerRoutes');
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.use('/admin', adminRouter);
app.use('/reader', readerRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});