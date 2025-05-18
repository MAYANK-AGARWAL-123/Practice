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
  status: {
    type: String,
    enum: ['available', 'borrowed'],
    default: 'available',
    required: true
  },
  borrowers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-hook to validate before borrowing
BookSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'borrowed' && this.borrowers.length === 0) {
    throw new Error('Cannot set status to borrowed without borrowers');
  }
  next();
});

module.exports = mongoose.model('Book', BookSchema);