const db = require('./db');

class Note {
    static async create(userId, title, content) {
        const result = await db.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, content]
        );
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const result = await db.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return result.rows;
    }

    static async delete(noteId, userId) {
        // Ensure the note belongs to the user for security
        const result = await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [noteId, userId]);
        return result.rows[0]; 
    }
}

module.exports = Note;