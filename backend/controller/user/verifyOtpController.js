const userModel = require("../../models/userModels");

async function verifyOtpController(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required", success: false });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

         // Log OTPs and expiration to debug comparison logic
         console.log("user.resetOtp:", user.resetOtp);
         console.log("Submitted OTP:", otp);
         console.log("OTP Expiration:", user.otpExpiration);
         console.log("Current Time:", Date.now());
 

        // Check OTP and expiration
        if (user.resetOtp !== otp || Date.now() > user.otpExpiration) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        // OTP is valid
        return res.status(200).json({ message: "OTP verified", success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = verifyOtpController;
