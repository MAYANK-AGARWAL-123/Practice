const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
    trim: true
  },
  socialMediaLinks: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true // Ensures one-to-one relationship
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);