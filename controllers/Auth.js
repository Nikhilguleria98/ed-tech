import User from "../models/User.js"
import OTP from "../models/OTP.js"
import otpGenertor from "otp-generator"


//send otp
export const sendOTP = async(req,res)=>{
    try {

        const {email} = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User already exist"
            })
        }

        //generate otp
        var otp = otpGenertor.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false

        })
        console.log("OTP generated",otp)

        //check unique otp or not
        const result = await OTP.findOne({otp:otp})
        while(result){
            otp = otpGenertor(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false

        })
        result = await OTP.findOne({otp:otp})
        }

        //create the entry for otp
        const otpPayload = {email,otp}
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody)

        return res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//sign up
export const signUp = async(req,res)=>{
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        if(!firstName ||!lastName ||!email ||!password ||!confirmPassword ||!otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //password matching
        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password value does not match! please try again later"
            })
        }

        //check existing user
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist"

            })
        }

        
        
    } catch (error) {
        
    }
}