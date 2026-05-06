import User from "../models/User.js";
import Tag from "../models/Tag.js";
import Course from "../models/Course.js";
import "../models/Section.js";
import "../models/SubSection.js";
import courseProgress from "../models/courseProgress.js";
import mongoose from "mongoose";
import { uploadFileToCloudinary } from "../utils/imageUploader.js";

// ✅ CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

    if (!courseName || !courseDescription || !whatYouWillLearn || price === undefined || price === "" || !tag) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({ success: false, message: "Thumbnail is required" });
    }

    const instructor = await User.findById(req.user.id);
    const tagDetails = await Tag.findById(tag);

    if (!instructor || instructor.accountType !== "Instructor") {
      return res.status(403).json({ success: false, message: "Only instructors can create courses" });
    }

    if (!tagDetails) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    const uploadedThumbnail = await uploadFileToCloudinary(
      req.files.thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructor._id,
      whatYouWillLearn,
      price: Number(price),
      tag: tagDetails._id,
      thumbnail: uploadedThumbnail.secure_url,
      studentsEnrolled: [],
    });

    await User.findByIdAndUpdate(instructor._id, {
      $addToSet: { courses: newCourse._id },
    });

    await Tag.findByIdAndUpdate(tagDetails._id, {
      $addToSet: { courses: newCourse._id },
    });

    res.json({ success: true, data: newCourse });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL COURSES
export const showAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor")
      .populate("tag")
      .exec();

    res.json({ success: true, data: courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE COURSE
export const getCourseDetails = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid course id" });
    }

    const course = await Course.findById(req.params.id)
      .populate("instructor")
      .populate("tag")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });

  } catch (error) {
    console.error("Get course details error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only update your own courses" });
    }

    const allowedFields = ["courseName", "courseDescription", "whatYouWillLearn", "price", "tag"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        course[field] = field === "price" ? Number(req.body[field]) : req.body[field];
      }
    });

    if (req.files?.thumbnail) {
      const uploaded = await uploadFileToCloudinary(
        req.files.thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = uploaded.secure_url;
    }

    await course.save();

    res.json({ success: true, data: course });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own courses" });
    }

    await Course.findByIdAndDelete(req.params.id);
    await User.updateMany({}, { $pull: { courses: req.params.id } });
    await Tag.updateMany({}, { $pull: { courses: req.params.id } });
    await courseProgress.deleteMany({ courseId: req.params.id });

    res.json({ success: true, message: "Course deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET INSTRUCTOR COURSES (🔥 MAIN FIX)
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("instructor")
      .populate("studentsEnrolled", "firstName lastName email image accountType")
      .sort({ updatedAt: -1 });

    res.set("Cache-Control", "no-store");
    res.json({ success: true, data: courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PURCHASE COURSE
// GET INSTRUCTOR DASHBOARD DATA
export const getInstructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("studentsEnrolled", "firstName lastName email image accountType")
      .sort({ updatedAt: -1 })
      .lean();

    const normalizedCourses = courses.map((course) => {
      const studentsEnrolled = (course.studentsEnrolled || []).filter(Boolean);

      return {
        ...course,
        studentsEnrolled,
        enrollmentCount: studentsEnrolled.length,
        revenue: studentsEnrolled.length * Number(course.price || 0),
      };
    });

    const totalRevenue = normalizedCourses.reduce(
      (total, course) => total + course.revenue,
      0
    );
    const totalStudents = normalizedCourses.reduce(
      (total, course) => total + course.enrollmentCount,
      0
    );
    const recentPurchases = normalizedCourses.flatMap((course) =>
      course.studentsEnrolled.map((student) => ({
        courseId: course._id,
        courseName: course.courseName,
        price: course.price,
        student,
      }))
    );

    res.set("Cache-Control", "no-store");
    res.json({
      success: true,
      data: {
        stats: {
          totalCourses: normalizedCourses.length,
          totalStudents,
          totalRevenue,
        },
        courses: normalizedCourses,
        recentPurchases,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const alreadyPurchased = course.studentsEnrolled.some((studentId) =>
      studentId.equals(userId)
    );

    if (alreadyPurchased) {
      const progress = await courseProgress.findOneAndUpdate(
        { userId, courseId },
        { $setOnInsert: { progressPercentage: 0, completedVideos: [] } },
        { new: true, upsert: true }
      );

      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          courses: courseId,
          courseProgress: progress._id,
        },
      });

      return res.json({ success: true, message: "Course already purchased" });
    }

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { studentsEnrolled: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { courses: courseId },
    });

    const progress = await courseProgress.findOneAndUpdate(
      { userId, courseId },
      { $setOnInsert: { progressPercentage: 0, completedVideos: [] } },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(userId, {
      $addToSet: { courseProgress: progress._id },
    });

    res.json({ success: true, message: "Purchased successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET STUDENT PURCHASED COURSES
export const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
          select: "firstName lastName email",
        },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const progressList = await courseProgress.find({
      userId: req.user.id,
      courseId: { $in: user.courses },
    });

    const progressByCourse = new Map(
      progressList.map((progress) => [
        progress.courseId.toString(),
        {
          progressId: progress._id,
          progressPercentage: progress.progressPercentage,
          completed: progress.progressPercentage >= 100,
        },
      ])
    );

    const courses = (user.courses || []).map((course) => {
      const courseObject = course.toObject();
      return {
        ...courseObject,
        progress: progressByCourse.get(course._id.toString()) || {
          progressPercentage: 0,
          completed: false,
        },
      };
    });

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET STUDENT DASHBOARD STATS
export const getStudentDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("courses courseProgress");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const enrolled = user.courses?.length || 0;
    const completed = await courseProgress.countDocuments({
      userId: req.user.id,
      courseId: { $in: user.courses || [] },
      progressPercentage: { $gte: 100 },
    });

    res.json({
      success: true,
      data: {
        enrolled,
        completed,
        inProgress: Math.max(enrolled - completed, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MARK A PURCHASED COURSE COMPLETE
export const markCourseCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId, courses: courseId });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Purchase this course before marking it complete",
      });
    }

    const progress = await courseProgress.findOneAndUpdate(
      { userId, courseId },
      { progressPercentage: 100 },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(userId, {
      $addToSet: { courseProgress: progress._id },
    });

    res.json({
      success: true,
      message: "Course marked as completed",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
