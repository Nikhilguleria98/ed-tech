import User from "../models/User.js"
import OTP from "../models/OTP.js"
import otpGenertor from "otp-generator"
import Profile from "../models/Profile.js"
import jwt from "jsonwebtoken"


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

        //find the most recent otp
        const recentOTP = await OTP.findOne({email}).sort({createdAt:-1}).limit(1)
        console.log(recentOTP)

        if(recentOTP.length ==0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
    else if(otp !==recentOTP.otp){
        return res.status(400).json({
            success:false,
            message:"Invalid otp"
        })
    }

    //hashed password
    const hashedPassword = await bcrypt.hash(password,10)

    //create entry in db

     const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
     })

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
        success:true,
        message:"User is registered successfully"
    })
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Error while creating account"
        })
    }
}

//login
export const login = async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check if user exist
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
              message:"User is not registered ! please signup first"
            })
        }

        //generate JWT ,after password matching
        if (await bcrypt.compare(password,user.password)){

            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user.token = token
            user.password = undefined
            
            //create cookie and send response
            const options = {
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
    
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"User logged in successfully",
                token,
                user
            })
        }

        else return res.status(400).json({
            success:false,
            message:"Incorrect password"
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Login failure ! try again"
        })
    }
}