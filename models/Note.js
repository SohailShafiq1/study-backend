const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  documentTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentType'
  },
  year: {
    type: String
  },
  path: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);