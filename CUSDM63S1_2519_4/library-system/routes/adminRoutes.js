const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/adminController');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

router.use(loggerMiddleware);

router.get('/books', getAllBooks);
router.post('/books', createBook);
router.patch('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

module.exports = router;