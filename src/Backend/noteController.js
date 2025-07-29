const db = require('./db');

exports.getNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
};

exports.createNote = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({ message: 'Note title is required' });
    }

    try {
        const result = await db.query(
            `INSERT INTO notes (user_id, title, content, created_at, updated_at)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [userId, title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).json({ message: 'Failed to create note' });
    }
};

exports.deleteNote = async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    try {
        await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [
            noteId,
            userId,
        ]);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).json({ message: 'Failed to delete note' });
    }
};
