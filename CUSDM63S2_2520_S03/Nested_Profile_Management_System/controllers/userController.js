const User = require('../models/User');

// Create a new user
exports.addUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Add profile to user
exports.addProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { profiles: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.profile) {
      query['profiles.profileName'] = req.query.profile;
    }
    
    const users = await User.find(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// Search users with name
exports.searchUsers = async (req, res, next) => {
  try {
    const { name, profile } = req.query;
    const user = await User.findOne({ name });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (profile) {
      const matchedProfile = user.profiles.find(p => p.profileName === profile);
      
      if (matchedProfile) {
        return res.status(200).json({
          success: true,
          data: matchedProfile
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'User found, but profile not found',
          user: {
            name: user.name,
            email: user.email,
            profiles: user.profiles
          }
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { 
        _id: req.params.userId,
        'profiles.profileName': req.params.profileName 
      },
      { $set: { 'profiles.$.url': req.body.url } },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User or profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Delete profile
exports.deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { profiles: { profileName: req.params.profileName } } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};