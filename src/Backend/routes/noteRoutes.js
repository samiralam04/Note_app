const express = require('express');
const router = express.Router();
const { protect } = require('../auth');
const {
    createNote,
    getNotes,
    deleteNote,
    updateNote, 
} = require('../noteController');

// Routes
router.route('/')
    .post(protect, createNote)   // Create a new note
    .get(protect, getNotes);     // Get all notes for the logged-in user

router.route('/:id')
    .delete(protect, deleteNote) // Delete a specific note
    .put(protect, updateNote);   // Update a specific note

module.exports = router;
