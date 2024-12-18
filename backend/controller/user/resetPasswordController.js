const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModels');

async function resetPasswordController(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.resetOtp = null;
        user.otpExpiration = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successful", success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = resetPasswordController;
