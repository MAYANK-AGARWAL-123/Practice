const Member = require('../models/Member');
const Book = require('../models/Book');

exports.addMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.getMemberBorrowedBooks = async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId)
      .populate('borrowedBooks', 'title author status');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member.borrowedBooks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};