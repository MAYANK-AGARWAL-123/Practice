const express = require('express');
const router = express.Router();
const {
  addBook,
  borrowBook,
  returnBook,
  getBookBorrowers,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const {
  addMember,
  getMemberBorrowedBooks
} = require('../controllers/memberController');

// Book routes
router.post('/add-book', addBook);
router.post('/borrow-book', borrowBook);
router.post('/return-book', returnBook);
router.get('/book-borrowers/:bookId', getBookBorrowers);
router.put('/update-book/:bookId', updateBook);
router.delete('/delete-book/:bookId', deleteBook);

// Member routes
router.post('/add-member', addMember);
router.get('/member-borrowed-books/:memberId', getMemberBorrowedBooks);

module.exports = router;