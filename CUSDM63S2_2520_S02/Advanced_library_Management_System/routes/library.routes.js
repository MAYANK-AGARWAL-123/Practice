const express = require('express');
const router = express.Router();
const {
  validateData,
  checkBorrowingLimit,
  calculateOverdueFees
} = require('../middleware/library.middleware');
const {
  addBook,
  borrowBook,
  returnBook,
  getBooks,
  deleteBook
} = require('../controllers/library.controller');

router.post('/books', validateData, addBook);

router.patch('/borrow/:id', checkBorrowingLimit, borrowBook);

router.patch('/return/:id', calculateOverdueFees, returnBook);

router.get('/books', getBooks);

router.delete('/books/:id', deleteBook);

module.exports = router;