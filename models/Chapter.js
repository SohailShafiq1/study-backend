const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique chapter names within a subject
chapterSchema.index({ name: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);