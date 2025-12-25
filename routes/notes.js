const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/Note');

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

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().populate('chapterId subjectId documentTypeId').sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a note
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    const note = new Note({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      pdfUrl: `/uploads/${req.file.filename}`,
      chapterId: req.body.chapterId,
      subjectId: req.body.subjectId,
      documentTypeId: req.body.documentTypeId || undefined,
      year: req.body.year || undefined,
      path: req.file.path
    });

    const savedNote = await note.save();
    await savedNote.populate('chapterId subjectId documentTypeId');
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Delete the file from filesystem if it exists
    try {
      if (note.path && fs.existsSync(note.path)) {
        fs.unlinkSync(note.path);
      }
    } catch (fsErr) {
      // Log filesystem error but continue to remove DB record
      console.error('Failed to delete note file:', fsErr);
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

module.exports = router;