const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  const classObj = new Class({
    name: req.body.name
  });

  try {
    const newClass = await classObj.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a class
router.delete('/:id', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;