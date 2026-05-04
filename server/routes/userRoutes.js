import express from 'express'
import { login, sendOTP, signUp } from '../controllers/Auth.js';

const router = express.Router()

router.post('/signup', signUp);
router.post('/login', login);
router.post('/sendOtp', sendOTP);

// //student
// router.get('/students', auth, isStudent, (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Welcome to the protected route for students",
//         user: req.existingUser 
//     });
// });

export default router