const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Please provide a street address'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please provide a state'],
    trim: true
  },
  country: {
    type: String,
    default: 'India',
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Please provide a pincode'],
    trim: true,
    match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit pincode']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);