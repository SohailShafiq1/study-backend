const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().populate('classId').sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  const subject = new Subject({
    name: req.body.name,
    classId: req.body.classId
  });

  try {
    const newSubject = await subject.save();
    await newSubject.populate('classId');
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;