import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createRating,
  getAllRatingAndReviews,
  getAverageRating,
} from "../controllers/RatingAndReviews.js";

const router = express.Router();

router.post("/create", auth, createRating);
router.get("/all", getAllRatingAndReviews);
router.get("/average/:courseId", getAverageRating);

export default router;
