const express = require('express');
const router = express.Router();
const {
  addUser,
  getUserRentals
} = require('../controllers/userController');
const {
  addBook,
  rentBook,
  returnBook,
  getBookRenters,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// User routes
router.post('/add-user', addUser);
router.get('/user-rentals/:userId', getUserRentals);

// Book routes
router.post('/add-book', addBook);
router.post('/rent-book', rentBook);
router.post('/return-book', returnBook);
router.get('/book-renters/:bookId', getBookRenters);
router.put('/update-book/:bookId', updateBook);
router.delete('/delete-book/:bookId', deleteBook);

module.exports = router;