const userModel = require("../models/userModels");

const uploadProductPermission = async (userId) => {
    try {
        console.log('Checking permission for User ID:', userId);

        const user = await userModel.findById(userId);

        if (!user) {
            console.error('User not found');
            return false;
        }

        console.log('User data:', user);
        if (user.role === 'Admin') {
            console.log('User is an Admin. Permission granted.');
            return true;
        }

        console.log('User is not an Admin. Permission denied.');
        return false;
    } catch (err) {
        console.error('Error in uploadProductPermission:', err.message || err);
        return false;
    }
};

module.exports = uploadProductPermission;
