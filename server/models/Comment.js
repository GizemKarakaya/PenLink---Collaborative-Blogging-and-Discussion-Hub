const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for anonymous users
  },
  authorName: {
    type: String,
    required: false // Will be validated in pre-save hook
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

// Validate authorName is required if author is null
commentSchema.pre('validate', function(next) {
  if (!this.author && !this.authorName) {
    this.invalidate('authorName', 'authorName is required when author is not provided');
  }
  next();
});

// Index for better query performance
commentSchema.index({ post: 1, submissionDate: -1 });

module.exports = mongoose.model('Comment', commentSchema);

