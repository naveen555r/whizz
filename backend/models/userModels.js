const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,

    email : {
        type: String,
        unique: true,
        required: true

    },
    
    password : String,

    role: { type: String, default: 'User' },
    
    resetOtp: String, // Store OTP

    otpExpiration: Date, // Store OTP expiration time
},{    
   timestamps : true  
})


const userModel = mongoose.model("user",userSchema)


module.exports = userModel
