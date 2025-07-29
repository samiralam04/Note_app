const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; 

class Token {
    static generateToken(userId) {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' }); // Token expires in 15 min
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