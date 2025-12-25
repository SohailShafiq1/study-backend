const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique subject names within a class
subjectSchema.index({ name: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);