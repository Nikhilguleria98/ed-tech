import Profile from "../models/Profile.js"
import User from "../models/User.js"

export const updateProfile = async(req,res)=>{
    try {
        //get data
        const {dateOfBith="",about="",contactNumber,gender} = req.body

        //get user id
        const id = req.user.id
        
        //validation
        if(!contactNumber ||!gender ||!id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //find profile
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBith,
        profileDetails.gender = gender,
        profileDetails.contactNumber = contactNumber,
        profileDetails.about = about
        await profileDetails.save()
        
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails
        })
        
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:"Internal server error",
            error:error.message
        })
    }
}


export const deleteAccount = async(req,res)=>{
    try {
        //get id 
        const id = req.user.id

        //validation
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User doest not exist"
            })
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})

        //delete user
        await User.findById({_id:id})

        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:"Error occur while deleting the user"
        })  
    }
}

export const getAllUserDetails = async(req,res)=>{
    try {
        //get id 
        const id = req.user.id

        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
 

        return res.status(200).json({
            success:true,
            message:"User data fetched successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:"Error occur while getting the user"
        })  
    }
}

