const express = require('express');
const app = express();
const PORT = 3000;

app.get('/home', (req, res) => {
  res.status(200).send('<h1>Welcome to Home Page</h1>');
});

app.get('/aboutus', (req, res) => {
  res.status(200).json({ message: 'Welcome to About Us' });
});

app.get('/contactus', (req, res) => {
  const contactDetails = {
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, Country'
  };
  res.status(200).json(contactDetails);
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});