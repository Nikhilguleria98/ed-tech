import express from "express";
import {
  createCourse,
  showAllCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
} from "../controllers/Course.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createCourse);
router.get("/all", showAllCourses);

// ✅ IMPORTANT ORDER
router.get("/instructor-courses", auth, getInstructorCourses);

router.get("/:id", getCourseDetails);
router.put("/:id", auth, updateCourse);
router.delete("/:id", auth, deleteCourse);

export default router;