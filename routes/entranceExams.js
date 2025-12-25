const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const EntranceExam = require('../models/EntranceExam');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get all entrance exams
router.get('/', async (req, res) => {
  try {
    const exams = await EntranceExam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload an entrance exam
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const exam = new EntranceExam({
      name: req.body.name,
      filename: req.file.filename,
      pdfUrl: `/uploads/${req.file.filename}`,
      path: req.file.path
    });

    const savedExam = await exam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an entrance exam
router.delete('/:id', async (req, res) => {
  try {
    const exam = await EntranceExam.findById(req.params.id);
    if (exam) {
      // Delete the file from filesystem
      fs.unlinkSync(exam.path);
    }
    await EntranceExam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entrance exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;