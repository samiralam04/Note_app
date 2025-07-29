const express = require('express');
const router = express.Router();
const { protect } = require('../auth');
const { createNote, getNotes, deleteNote } = require('../noteController');

router.route('/').post(protect, createNote).get(protect, getNotes);
router.route('/:id').delete(protect, deleteNote);

module.exports = router;