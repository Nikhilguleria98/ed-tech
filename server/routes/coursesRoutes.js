import express from "express";
import {
  createCourse,
  showAllCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
} from "../controllers/Course.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// ✅ CREATE
router.post("/create", auth, createCourse);

// ✅ GET ALL
router.get("/all", showAllCourses);

// ✅ GET SINGLE (FIXED 🔥)
router.get("/:id", getCourseDetails);

// ✅ UPDATE
router.put("/:id", auth, updateCourse);

// ✅ DELETE
router.delete("/:id", auth, deleteCourse);

export default router;