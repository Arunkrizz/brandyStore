const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    Email:
    {
        type:String,
        unique:true
    },
    otp:String,
    createdAt:Date,
    expiresAt:Date,
});

const OTP=mongoose.model("otp",otpSchema)

module.exports=OTP