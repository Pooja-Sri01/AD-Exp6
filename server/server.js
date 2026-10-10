require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesDB';

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/notes', noteRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Notes API Server is up and running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Notes-Taking Application API',
    endpoints: {
      getAllNotes: 'GET /api/notes',
      getSingleNote: 'GET /api/notes/:id',
      createNote: 'POST /api/notes',
      updateNote: 'PUT /api/notes/:id',
      deleteNote: 'DELETE /api/notes/:id',
      healthCheck: 'GET /api/health',
    },
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: err.message,
  });
});

// Connect to MongoDB and start the server
console.log('Connecting to MongoDB at:', MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database: notesDB');
    app.listen(PORT, () => {
      console.log(`Notes Server is running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api/notes`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
