const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Note = require('../models/Note');

// Helper to check valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @route   GET /api/notes
// @desc    Retrieve all notes (supports optional ?search= query)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let queryFilter = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      queryFilter = {
        $or: [{ title: regex }, { description: regex }],
      };
    }

    const notes = await Note.find(queryFilter).sort({ updatedAt: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notes',
      error: error.message,
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Retrieve a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format',
      });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching note',
      error: error.message,
    });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required and cannot be empty',
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required and cannot be empty',
      });
    }

    const newNote = new Note({
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedNote = await newNote.save();
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: savedNote,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating note',
      error: error.message,
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format',
      });
    }

    // Validation
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
      });
    }

    if (description !== undefined && description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be empty',
      });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    if (title !== undefined) note.title = title.trim();
    if (description !== undefined) note.description = description.trim();
    note.updatedAt = new Date();

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating note',
      error: error.message,
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format',
      });
    }

    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: note._id },
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting note',
      error: error.message,
    });
  }
});

module.exports = router;
