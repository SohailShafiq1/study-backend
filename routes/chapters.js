const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// Get all chapters
router.get('/', async (req, res) => {
  try {
    const chapters = await Chapter.find().populate('subjectId').sort({ createdAt: -1 });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new chapter
router.post('/', async (req, res) => {
  const chapter = new Chapter({
    name: req.body.name,
    subjectId: req.body.subjectId
  });

  try {
    const newChapter = await chapter.save();
    await newChapter.populate('subjectId');
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a chapter
router.delete('/:id', async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;