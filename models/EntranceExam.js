const mongoose = require('mongoose');

const entranceExamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  filename: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EntranceExam', entranceExamSchema);