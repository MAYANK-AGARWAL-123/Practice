const express = require('express');
const router = express.Router();
const {
  getAvailableBooks,
  borrowBook,
  returnBook
} = require('../controllers/readerController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');
const returnCheckMiddleware = require('../middlewares/returnCheckMiddleware');
const transactionLogger = require('../middlewares/transactionLogger');

router.use(loggerMiddleware);
router.use(transactionLogger);

router.get('/books', getAvailableBooks);
router.post('/borrow/:id', borrowBook);
router.post('/return/:id', returnCheckMiddleware, returnBook);

module.exports = router;