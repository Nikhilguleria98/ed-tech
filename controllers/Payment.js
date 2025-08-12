import mongoose from 'mongoose';
import Course from '../models/Course.js';
import { instance } from '../config/razorpay.js';
import User from '../models/User.js';
import mailSender from '../utils/mailSender.js';

export const capturePayment = async (req, res) => {
  try {
    // get courseid and userid
    const { course_id } = req.body;
    const userId = req.user.id;

    // validate course id
    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course Id",
      });
    }

    // fetch course details
    let course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Could not find course",
      });
    }

    // check if user already enrolled
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }


    //order create
    const amount = course.price
    const currency = "INR"

    const options = {
        amount : amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId
        }
    }

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)

        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
        
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:"Could not initiate order"
        })
    }
  

  } catch (error) {
    console.error("Error in capturePayment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//verify signature of Razorpay and server

export const verifySignature = async(req,res)=>{

    const webhookSecret = "123456"

    const signature = req.headers["x-razorpay-signature"]
    const shashum = crypto.createHmac("sha256",webhookSecret)
    shashum.update(JSON.stringify(req.body))
    const digest = shashum.digest("hex")

    if(signature === digest){
        console.log("Payment authorized")

        const {courseId , userId}  = req.body.payload.payment.entity.notes

        try {

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}},{new:true})
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }

        //find the course and add the course to their enrolled course list
        const enrolledStudent = await User.findOneAndUpdate(
                                                            {_id:userId},
                                                            {$push:{courses:courseId}},
                                                            {new:true})

        //send the confirmation mail
        const emailResponse = await mailSender(
                                               enrolledStudent.email,
                                               "Congratulations from Nikhil",
                                               "Congratulations, you are onboard to new course"
        )                                                    
         
        return res.json({
            success:true,
            message:"Signature verified and course added"
        })
        } catch (error) {
            
        }
    }
    else {
        return res.status(400).json({
            success:true,
            message:"Invalid request"
        }) 
    }
}