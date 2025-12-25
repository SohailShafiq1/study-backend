const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('Starting server...');
console.log('Node version:', process.version);
console.log('PORT env:', process.env.PORT);

const app = express();

// Middleware - Simplified CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'http://localhost:5175',
    'https://studywithmaryam.online',
    'https://www.studywithmaryam.online',
    'https://study-frontend-two.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1,
    mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Study with Maryam API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      classes: '/api/classes',
      subjects: '/api/subjects',
      chapters: '/api/chapters',
      notes: '/api/notes',
      entranceExams: '/api/entrance-exams',
      documentTypes: '/api/document-types'
    }
  });
});

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/study-with-maryam';
console.log('Attempting MongoDB connection...');
console.log('MongoDB URI present:', mongoUri ? 'Yes' : 'No');

mongoose.connect(mongoUri)
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('Server will continue but database operations will fail');
});

// Routes
app.use('/api/classes', require('./routes/classes'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/chapters', require('./routes/chapters'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/entrance-exams', require('./routes/entranceExams'));
app.use('/api/document-types', require('./routes/documentTypes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Cannot ${req.method} ${req.url}` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});