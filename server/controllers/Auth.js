import User from "../models/User.js";
import OTP from "../models/OTP.js";
import otpGenerator from "otp-generator";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ================= SEND OTP =================
export const sendOTP = async (req, res) => {
  try {
    let { email } = req.body;

    // ✅ normalize email
    email = email.trim().toLowerCase();

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ delete old OTPs
    await OTP.deleteMany({ email });

    // generate OTP
    let otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", otp);

    // ensure unique OTP
    let result = await OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp });
    }

    // save OTP
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log("Send OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// ================= SIGNUP =================
export const signUp = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // ✅ normalize email
    email = email.trim().toLowerCase();

    // validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // get latest OTP
    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    console.log("Entered OTP:", otp);
    console.log("DB OTP:", recentOTP?.otp);

    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // compare OTP safely
    if (String(otp) !== String(recentOTP.otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // ✅ delete OTP after success
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};