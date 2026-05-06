import express from 'express'
import { changePassword, login, sendOTP, signUp } from '../controllers/Auth.js';
import {  purchaseCourse } from '../controllers/Course.js';
import { auth } from '../middleware/auth.js';
import { getAllUserDetails, updateProfile } from '../controllers/Profile.js';

const router = express.Router()

router.post('/signup', signUp);
router.post('/login', login);
router.post('/send-otp', sendOTP);

// router.get("/student/dashboard", auth, getStudentDashboard);

router.get("/user/me", auth, getAllUserDetails);
router.put("/user/update-profile", auth, updateProfile);
router.put("/user/change-password", auth, changePassword);

router.post("/purchase", auth, purchaseCourse);

// //student
// router.get('/students', auth, isStudent, (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Welcome to the protected route for students",
//         user: req.existingUser 
//     });
// });

export default router