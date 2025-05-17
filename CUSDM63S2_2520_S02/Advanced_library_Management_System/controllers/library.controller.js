const Library = require('../models/library.model');

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const book = await Library.create({
      title: req.body.title,
      author: req.body.author,
      status: 'available'
    });
    
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { borrowerName } = req.body;
    const { id } = req.params;
    
    const book = await Library.findByIdAndUpdate(
      id,
      {
        status: 'borrowed',
        borrowerName,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book borrowed successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Library.findByIdAndUpdate(
      id,
      {
        status: 'available',
        borrowerName: null,
        returnDate: new Date(),
        overdueFees: req.overdueFees
      },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: book
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all books with optional filtering
exports.getBooks = async (req, res) => {
  try {
    const { status, title } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (title) query.title = { $regex: title, $options: 'i' };
    
    const books = await Library.find(query);
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Library.findById(id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }
    
    if (book.status === 'borrowed') {
      return res.status(409).json({ 
        success: false, 
        message: 'Cannot delete a borrowed book' 
      });
    }
    
    await Library.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {}
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};