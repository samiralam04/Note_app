const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Your OTP for Login',
        html: `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
               <p>This OTP is valid for 10 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${toEmail}`);
        return true;
    } catch (error) {
        console.error(`Error sending OTP email to ${toEmail}:`, error);
        return false;
    }
};

module.exports = { sendOtpEmail };