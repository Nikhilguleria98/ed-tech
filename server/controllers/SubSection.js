import Section from "../models/Section";
import SubSection from "../models/SubSection.js";
import { uploadFileToCloudinary } from "../utils/imageUploader.js";


export const createSubSection = async(req,res)=>{
    try {
        //fetch data
        const {sectionId,title,timeDuration,description} = req.body;
        //extract video file
        const video = req.files.videoFile

        //validation
        if(!sectionId ||!title ||!timeDuration ||!description){
            return res.status(200).json({
                success:false,
                message:"All fields are required"
            })
        }
        
        //upload video to cloudinary
        const uploadDetails = await uploadFileToCloudinary(video,process.env.FOLDER_NAME)

        //create sub-section
        const SubSectionDetails  = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })

        //update section with this sub-section onjectid
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                               {
                                                                $push:{
                                                                    subSection:SubSectionDetails._id
                                                                }
                                                               },{new:true})
        
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-Section created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        })
    }
}