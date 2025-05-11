const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    if (!title || !author || !genre || !publishedYear) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.update(parseInt(req.params.id), req.body);
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const isDeleted = await Book.delete(parseInt(req.params.id));
    if (!isDeleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook
};