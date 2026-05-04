import {v2 as cloudinary} from "cloudinary"

export const uploadFileToCloudinary = async(File,folder,height,quality)=>{
    const {options} = folder

    if(height){
        options.height = height
    }
    if(quality){
        options.quality = quality

        options.resource_type = "auto"

        await cloudinary.uploader.upload(File.tempFilePath,options)
    }
}