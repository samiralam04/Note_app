const express = require('express');
const router = express.Router();
const {
    registerUser,
    requestOtp,
    verifyOtp,
    loginUser,
    googleAuth,
} = require('../authController'); // <- using named handlers

router.post('/register', registerUser);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/google', googleAuth);

module.exports = router;
