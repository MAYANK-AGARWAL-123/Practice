const Book = require('../models/Book');

const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.getAvailableBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { readerName } = req.body;
    if (!readerName) {
      return res.status(400).json({ error: 'Reader name is required' });
    }
    
    const book = await Book.borrow(parseInt(req.params.id), readerName);
    if (!book) {
      return res.status(400).json({ error: 'Book not available or not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const book = await Book.return(parseInt(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found or not borrowed' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAvailableBooks,
  borrowBook,
  returnBook
};