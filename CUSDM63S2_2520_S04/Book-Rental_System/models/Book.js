const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    minlength: [3, 'Title must be at least 3 characters'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author'],
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  rentedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);