const Book = require('../models/Book');

const transactionLogger = async (req, res, next) => {
  const originalJson = res.json;
  res.json = async function(data) {
    try {
      if (req.method === 'POST' && req.originalUrl.includes('/borrow')) {
        const book = await Book.findById(parseInt(req.params.id));
        console.log(`[${new Date().toISOString()}] ${req.body.readerName} borrowed "${book.title}"`);
      } else if (req.method === 'POST' && req.originalUrl.includes('/return')) {
        const book = await Book.findById(parseInt(req.params.id));
        console.log(`[${new Date().toISOString()}] ${book.borrowedBy} returned "${book.title}"`);
      }
    } catch (error) {
      console.error('Transaction logging failed:', error);
    }
    originalJson.call(this, data);
  };
  next();
};

module.exports = transactionLogger;