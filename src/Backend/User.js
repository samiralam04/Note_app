const db = require('./db'); 

class User {
    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByGoogleId(googleId) {
        const result = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        return result.rows[0];
    }

    static async create(email, googleId = null) {
        const result = await db.query(
            'INSERT INTO users (email, google_id) VALUES ($1, $2) RETURNING *',
            [email, googleId]
        );
        return result.rows[0];
    }

    static async updateOtp(email, otp, otpExpiresAt) {
        await db.query(
            'UPDATE users SET otp = $1, otp_expires_at = $2 WHERE email = $3',
            [otp, otpExpiresAt, email]
        );
    }

    static async clearOtp(email) {
        await db.query(
            'UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE email = $1',
            [email]
        );
    }
}

module.exports = User;