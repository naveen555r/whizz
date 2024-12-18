const userModel = require('../../models/userModels');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


// Log environment variables to ensure they are loaded
console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);


// Create a reusable transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
});

async function sendOtpController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiration = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        // Save OTP and expiration to user record
        user.resetOtp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
        });

        return res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = sendOtpController;
