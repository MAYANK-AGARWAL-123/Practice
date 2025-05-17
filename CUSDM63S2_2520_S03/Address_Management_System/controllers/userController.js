const User = require('../models/User');
const Address = require('../models/Address');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Add address for a user
exports.addAddress = async (req, res) => {
  try {
    req.body.user = req.params.userId;
    const address = await Address.create(req.body);
    
    res.status(201).json({
      success: true,
      data: address
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Get user summary
exports.getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAddresses = await Address.countDocuments();
    
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'addresses',
          localField: '_id',
          foreignField: 'user',
          as: 'addresses'
        }
      },
      {
        $project: {
          name: 1,
          addressCount: { $size: '$addresses' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAddresses,
        users
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user details with addresses
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const addresses = await Address.find({ user: req.params.userId });
    
    res.status(200).json({
      success: true,
      data: {
        user,
        addresses
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.addressId,
      user: req.params.userId
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};