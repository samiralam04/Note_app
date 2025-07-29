const { Pool } = require('pg');
require('dotenv').config();

// --- ADD THESE DEBUGGING LINES ---
console.log('--- Environment Variables ---');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****** (present)' : 'NOT SET'); // To avoid logging password directly
console.log('Type of DB_PASSWORD:', typeof process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('-----------------------------');
// --- END DEBUGGING LINES ---


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL database connected successfully!');
        await createTables();
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

const createTables = async () => {
    // ... (rest of your createTables function)
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255),
            google_id VARCHAR(255) UNIQUE,
            otp VARCHAR(6),
            otp_expires_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createNotesTable = `
        CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(createUsersTable);
        await pool.query(createNotesTable);
        console.log('Tables "users" and "notes" checked/created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    connectDB,
};