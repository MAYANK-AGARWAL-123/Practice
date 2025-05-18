const Book = require('../models/Book');
const Member = require('../models/Member');

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

exports.borrowBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book || !member) {
      return res.status(404).json({
        success: false,
        error: 'Book or Member not found'
      });
    }

    if (book.status === 'borrowed' && book.borrowers.includes(memberId)) {
      return res.status(400).json({
        success: false,
        error: 'Book already borrowed by this member'
      });
    }

    // Update book
    book.status = 'borrowed';
    if (!book.borrowers.includes(memberId)) {
      book.borrowers.push(memberId);
    }
    await book.save();

    // Update member
    if (!member.borrowedBooks.includes(bookId)) {
      member.borrowedBooks.push(bookId);
      await member.save();
    }

    res.status(200).json({
      success: true,
      message: 'Book borrowed successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book || !member) {
      return res.status(404).json({
        success: false,
        error: 'Book or Member not found'
      });
    }

    if (!book.borrowers.includes(memberId)) {
      return res.status(400).json({
        success: false,
        error: 'This member did not borrow this book'
      });
    }

    // Update book
    book.borrowers.pull(memberId);
    book.status = book.borrowers.length > 0 ? 'borrowed' : 'available';
    await book.save();

    // Update member
    member.borrowedBooks.pull(bookId);
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getBookBorrowers = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('borrowers', 'name email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book.borrowers
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
    // First remove book from all members' borrowedBooks
    await Member.updateMany(
      { borrowedBooks: req.params.bookId },
      { $pull: { borrowedBooks: req.params.bookId } }
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