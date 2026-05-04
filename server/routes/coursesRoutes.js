import { 
  createCourse, 
  showAllCourses, 
  getCourseDetails,
  updateCourse,
  deleteCourse,
  
} from "../controllers/Course.js";
import express from 'express'

import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post("/create", auth, createCourse);
router.get("/all", showAllCourses);
router.post("/details", getCourseDetails);

// NEW
router.put("/update", auth, updateCourse);
router.delete("/delete", auth, deleteCourse);


export default router