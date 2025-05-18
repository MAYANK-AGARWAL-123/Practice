const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');

// Add new user
router.post('/add-user', async (req, res) => {
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
});

// Add profile for a user
router.post('/add-profile', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ user: req.body.user });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        error: 'Profile already exists for this user'
      });
    }

    const profile = await Profile.create(req.body);
    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// Get all profiles with user details
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email');
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;