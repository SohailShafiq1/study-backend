const express = require('express');
const router = express.Router();
const DocumentType = require('../models/DocumentType');

// Get all document types
router.get('/', async (req, res) => {
  try {
    const types = await DocumentType.find().populate('chapterId').sort({ createdAt: -1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a document type
router.post('/', async (req, res) => {
  try {
    const dt = new DocumentType({ name: req.body.name, chapterId: req.body.chapterId });
    const saved = await dt.save();
    await saved.populate('chapterId');
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a document type
router.delete('/:id', async (req, res) => {
  try {
    await DocumentType.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document type deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
