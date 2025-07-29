const express = require('express');
const router = express.Router();
const {
    
    requestOtp,
    verifyOtp,
    loginUser,
    googleAuth,
} = require('../authController'); 


router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/google', googleAuth);

module.exports = router;
