const mongoose = require('mongoose');
const validator = require('validator');

const profileSchema = new mongoose.Schema({
  profileName: {
    type: String,
    enum: {
      values: ['fb', 'twitter', 'github', 'instagram'],
      message: 'Profile name must be fb, twitter, github, or instagram'
    },
    required: [true, 'Profile name is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: validator.isURL,
      message: 'Please provide a valid URL'
    }
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profiles: [profileSchema]
}, { timestamps: true });

userSchema.path('profiles').validate(function(profiles) {
  const profileNames = profiles.map(p => p.profileName);
  return new Set(profileNames).size === profileNames.length;
}, 'User cannot have duplicate profiles for the same platform');

module.exports = mongoose.model('User', userSchema);