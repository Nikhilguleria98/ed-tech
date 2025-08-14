import mongoose from 'mongoose'
import Course from '../models/Course.js'
import RatingAndReviews from '../models/RatingAndReviews.js'


//create rating
export const createRating  = async(req,res)=>{
    try {
        //get userid
        const userid = req.user.id

        //fetch data from req body
        const {rating , reviews , courseId} = req.body

        //check if user enrolled or not
        const courseDetails = await Course.findOne({_id:courseId , studentsEnrolled: {$elemMatch: {$eq: userid}}})
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }

        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReviews.findOne({
                                                               user:userid,
                                                               course:courseId
                                                                })
        
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course already reviewed by the user"
            })
        }

        //create rating and review
        const ratingReview = await RatingAndReviews.create({rating,reviews,course:courseId,user:userid})

        //update course with this rating/review
     const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {$push:{ratingAndReviews:ratingReview._id}},{new:true})

     return res.status(200).json({
        success:true,
        message:"Rating and reviews created successfuflly"
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get average rating

export const getAverageRating = async(req,res)=>{
    try {

        //get courseid
        const courseId = req.body.courseId

        //calculate average rating
        const result  = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg:"$rating"}
                }
            }
        ])

        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            })
        }
        
    } catch (error) {
        
    }
}


//getAllRatingAndReviews
export const getAllRatingAndReviews = async(req,res)=>{
    try {
        const allReviews = await RatingAndReviews.find({})
                                                 .sort({rating:"desc"})
                                                 .populate({
                                                    path:"user",
                                                    select:"firstName,lastName,email,image"
                                                 })
                                                 .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                 })
                                                 .exec()
            
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}