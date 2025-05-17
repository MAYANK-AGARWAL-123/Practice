const Library = require('../models/library.model');

// Data validation middleware
exports.validateData = (req, res, next) => {
  const { title, author } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ 
      success: false, 
      message: 'Incomplete Data: Title and author are required' 
    });
  }
  next();
};

// Borrowing limit middleware
exports.checkBorrowingLimit = async (req, res, next) => {
  const { borrowerName } = req.body;
  
  try {
    const borrowedBooksCount = await Library.countDocuments({ 
      borrowerName, 
      status: 'borrowed' 
    });
    
    if (borrowedBooksCount >= 3) {
      return res.status(409).json({ 
        success: false, 
        message: 'Borrowing limit exceeded (max 3 books)' 
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Overdue fee calculation
exports.calculateOverdueFees = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const book = await Library.findById(id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }
    
    if (book.status !== 'borrowed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Book is not currently borrowed' 
      });
    }
    
    const today = new Date();
    const dueDate = new Date(book.dueDate);
    
    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      req.overdueFees = diffDays * 10; 
    } else {
      req.overdueFees = 0;
    }
    
    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};