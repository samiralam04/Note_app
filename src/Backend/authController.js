const User = require('./User');
const Token = require('./Token');
const { sendOtpEmail } = require('./otpService');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const requestOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please enter an email address' });
    }
    try {
        let user = await User.findByEmail(email);
        if (!user) {
            user = await User.create(email);
        }
        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await User.updateOtp(email, otp, otpExpiresAt);
        const emailSent = await sendOtpEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }
        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in requestOtp:', error);
        res.status(500).json({ message: 'Server error during OTP sending' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Please provide email and OTP' });
    }
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.otp === otp && user.otp_expires_at && new Date(user.otp_expires_at) > new Date()) {
            await User.clearOtp(email);
            const token = Token.generateToken(user.id);
            const userResponse = { ...user };
            delete userResponse.otp;
            delete userResponse.otp_expires_at;
            delete userResponse.password;
            res.status(200).json({
                message: 'Login successful',
                user: userResponse,
                token,
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

const googleAuth = async (req, res) => {
    const { email, name, picture } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: 'Missing Google user data' });
    }

    try {
        let user = await User.findByEmail(email);
        if (!user) {
            user = await User.create(email, null, name, picture); 
        }

        const token = Token.generateToken(user.id);
        const userResponse = { ...user };
        delete userResponse.otp;
        delete userResponse.otp_expires_at;
        delete userResponse.password;

        res.status(200).json({
            message: 'Google login successful',
            user: userResponse,
            token,
        });
    } catch (error) {
        console.error('Error in Google login:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
};

// placeholder


const loginUser = (req, res) => {
    res.status(501).json({ message: "Not implemented yet" });
};

module.exports = {
    requestOtp,
    verifyOtp,
    loginUser,
    googleAuth,
};
