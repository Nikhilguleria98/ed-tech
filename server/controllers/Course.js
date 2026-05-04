import User from "../models/User.js";
import Tag from "../models/Tag.js";
import { uploadFileToCloudinary } from "../utils/imageUploader.js";
import Course from "../models/Course.js";



export const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
    } = req.body;

    // ✅ Validation
    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Thumbnail check
    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    const thumbnail = req.files.thumbnail;

    // ✅ Instructor
    const userID = req.user.id;
    const instructor = await User.findById(userID);

    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // ✅ Tag check
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tag",
      });
    }

    // ✅ Upload image
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // ✅ Create course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructor._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // ✅ Add to instructor
    await User.findByIdAndUpdate(instructor._id, {
      $push: { courses: newCourse._id },
    });

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//get all courses
export const showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({},
                                         {
                                         courseName: true,
                                         courseDescription:true,
                                         price: true,
                                         thumbnail: true,
                                         instructor: true,
                                         ratingAndReviews: true,
                                         studentsEnrolled: true,
                                         }).populate("instructor").exec();
    
                return res.status(200).json({
                    success:true,
                    message:"Data for all courses fetched successfully",
                    data:allCourses
                })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  }
};


//get all course details
export const getCourseDetails = async(req,res)=>{
  try {

    //get id 
    const {courseId} = req.body;

    //find course details
    const courseDetails = await Course.find({_id:courseId}).
                                                         populate(
                                                          {
                                                            path:"instructor",
                                                            populate:{
                                                              path:"additionalDetails"
                                                            }

                                                         })
                                                         .populate("tag")
                                                         .populate("ratingAndReviews")
                                                         .populate(
                                                          {
                                                            path:"courseContent",
                                                            populate:{
                                                              path:"subSection"
                                                            }
                                                          }
                                                         )
                                                         .exec()
      
      //validation
      if(!courseDetails){
        return res.status(400).json({
          success:false,
          message:`Could not find the course with ${courseId}`
        })
      }
    
  return res.status(200).json({
    success:true,
    message:"Course details fetched successfully",
    data:courseDetails
  })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}


// UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const { courseId, courseName, courseDescription, price, tag, whatYouWillLearn } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ update text fields
    if (courseName) course.courseName = courseName;
    if (courseDescription) course.courseDescription = courseDescription;
    if (price) course.price = price;
    if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn;

    if (tag) course.tag = tag;

    // 🔥 FIX: thumbnail update
    if (req.files && req.files.thumbnail) {
      const thumbnail = req.files.thumbnail;

      const uploaded = await uploadFileToCloudinary(
        thumbnail,
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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};