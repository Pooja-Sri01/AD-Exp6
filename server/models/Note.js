const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving updates
noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Explicitly use collection name 'notes'
const Note = mongoose.model('Note', noteSchema, 'notes');

module.exports = Note;
