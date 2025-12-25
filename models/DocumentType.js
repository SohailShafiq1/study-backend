const mongoose = require('mongoose');

const documentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true }
}, { timestamps: true });

module.exports = mongoose.model('DocumentType', documentTypeSchema);
