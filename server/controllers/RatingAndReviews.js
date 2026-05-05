import mongoose from "mongoose";
import Course from "../models/Course.js";
import RatingAndReviews from "../models/RatingAndReviews.js";


// ⭐ CREATE REVIEW
export const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // ✅ Check enrollment
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // ✅ Prevent duplicate review
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this course",
      });
    }

    // ✅ Create review
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // ✅ Push to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingReview._id },
    });

    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: ratingReview,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ⭐ GET AVERAGE RATING
export const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      averageRating: 0,
      message: "No ratings yet",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ⭐ GET ALL REVIEWS (OPTIONAL FILTER BY COURSE)
export const getAllRatingAndReviews = async (req, res) => {
  try {
    const { courseId } = req.query;

    let filter = {};
    if (courseId) {
      filter.course = courseId;
    }

    const allReviews = await RatingAndReviews.find(filter)
      .sort({ rating: -1 })
      .populate({
        path: "user",
        select: "firstName lastName image",
      })
      .populate({
        path: "course",
        select: "courseName",
      });

    return res.status(200).json({
      success: true,
      data: allReviews,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};