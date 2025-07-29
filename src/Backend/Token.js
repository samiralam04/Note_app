// src/Backend/Token.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is in your .env file

class Token {
    static generateToken(userId) {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null; // Token is invalid or expired
        }
    }
}

module.exports = Token;