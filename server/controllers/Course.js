import User from "../models/User.js";
import Tag from "../models/Tag.js";
import Course from "../models/Course.js";
import courseProgress from "../models/courseProgress.js";
import { uploadFileToCloudinary } from "../utils/imageUploader.js";

// ✅ CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({ success: false, message: "Thumbnail is required" });
    }

    const instructor = await User.findById(req.user.id);
    const tagDetails = await Tag.findById(tag);

    const uploadedThumbnail = await uploadFileToCloudinary(
      req.files.thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructor._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: uploadedThumbnail.secure_url,
      studentsEnrolled: [],
    });

    await User.findByIdAndUpdate(instructor._id, {
      $push: { courses: newCourse._id },
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
      .exec();

    res.json({ success: true, data: courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE COURSE
export const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });

  } catch (error) {
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

    Object.assign(course, req.body);

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
    await Course.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Course deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET INSTRUCTOR COURSES (🔥 MAIN FIX)
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("instructor");

    res.json({ success: true, data: courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PURCHASE COURSE
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false });
    }

    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already purchased" });
    }

    course.studentsEnrolled.push(userId);
    await course.save();

    await User.findByIdAndUpdate(userId, {
      $push: { purchasedCourses: courseId },
    });

    res.json({ success: true, message: "Purchased successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};