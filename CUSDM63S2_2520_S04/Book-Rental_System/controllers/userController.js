const User = require('../models/User');

exports.addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('rentedBooks', 'title author genre');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.rentedBooks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};