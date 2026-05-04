import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

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
    default: Date.now,
    expires: 10 * 60, // ✅ 10 minutes (increase for better UX)
  },
});

// 🔐 Send email after OTP save
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification email from Nikhil Guleria",
      `Your OTP is: ${otp}`
    );
    console.log("Email sent successfully", mailResponse);
  } catch (error) {
    console.log("Error sending email:", error);
  }
}

// 🔁 Pre-save hook
otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;