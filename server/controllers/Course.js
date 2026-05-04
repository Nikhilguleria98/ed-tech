import User from "../models/User.js";
import Tag from "../models/Tag.js";
import { uploadFileToCloudinary } from "../utils/imageUploader";
import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnail;

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    const userID = req.user.id;
    const instructorDetails = await User.findById(userID);

    console.log("Instructor details", instructorDetails);
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    //check given tag is valid or not
    const tagsDetails = await Tag.findById(tag);

    //uplaod image to cloudinary
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagsDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //add the new course to user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //return response
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