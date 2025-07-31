import { request } from "express";
import mongoose from "mongoose";
import mailSender from "../utils/mailSender";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerificationEmail(email,otp){
    try {

        const mailResponse = await mailSender(email,"Verification email from Nikhil Guleria",otp)
        console.log("Email sent successfully",mailResponse)
        
    } catch (error) {
        console.log("error occured while sending the email",error)
    }
}

otpSchema.pre('save',async function(next){
    await sendVerificationEmail(this.email,this.otp)
    next()
})

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
