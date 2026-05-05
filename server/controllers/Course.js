import User from "../models/User.js";
import Tag from "../models/Tag.js";
import { uploadFileToCloudinary } from "../utils/imageUploader.js";
import Course from "../models/Course.js";


// ✅ CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
    } = req.body;

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    const thumbnail = req.files.thumbnail;

    const instructor = await User.findById(req.user.id);
    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tag",
      });
    }

    const uploadedThumbnail = await uploadFileToCloudinary(
      thumbnail,
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
    });

    await User.findByIdAndUpdate(instructor._id, {
      $push: { courses: newCourse._id },
    });

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET ALL COURSES
export const showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}, {
      courseName: true,
      courseDescription: true,
      price: true,
      thumbnail: true,
      instructor: true,
    })
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET SINGLE COURSE (FIXED 🔥)
export const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId)
      .populate("instructor")
      .populate("tag");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });

  } catch (error) {
    console.log("ERROR:", error); // 🔥 VERY IMPORTANT
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const { courseName, courseDescription, price, tag, whatYouWillLearn } = req.body;

    if (courseName) course.courseName = courseName;
    if (courseDescription) course.courseDescription = courseDescription;
    if (price) course.price = price;
    if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn;
    if (tag) course.tag = tag;

    if (req.files && req.files.thumbnail) {
      const uploaded = await uploadFileToCloudinary(
        req.files.thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = uploaded.secure_url;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};