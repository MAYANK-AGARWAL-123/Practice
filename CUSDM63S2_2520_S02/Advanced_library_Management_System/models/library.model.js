const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'reserved'],
    default: 'available'
  },
  borrowerName: {
    type: String,
    trim: true
  },
  borrowDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  overdueFees: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Library', LibrarySchema);