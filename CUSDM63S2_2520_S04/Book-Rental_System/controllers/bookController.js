const Book = require('../models/Book');
const User = require('../models/User');

exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.rentBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Check if already rented
    if (user.rentedBooks.includes(bookId)) {
      return res.status(400).json({
        success: false,
        error: 'Book already rented by this user'
      });
    }

    // Update both collections
    await User.findByIdAndUpdate(userId, {
      $addToSet: { rentedBooks: bookId }
    });

    await Book.findByIdAndUpdate(bookId, {
      $addToSet: { rentedBy: userId }
    });

    res.status(200).json({
      success: true,
      message: 'Book rented successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Remove from user's rentedBooks
    await User.findByIdAndUpdate(userId, {
      $pull: { rentedBooks: bookId }
    });

    // Remove from book's rentedBy
    await Book.findByIdAndUpdate(bookId, {
      $pull: { rentedBy: userId }
    });

    res.status(200).json({
      success: true,
      message: 'Book returned successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

exports.getBookRenters = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('rentedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book.rentedBy
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    // First remove book from all users' rentedBooks
    await User.updateMany(
      { rentedBooks: req.params.bookId },
      { $pull: { rentedBooks: req.params.bookId } }
    );

    // Then delete the book
    const book = await Book.findByIdAndDelete(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};