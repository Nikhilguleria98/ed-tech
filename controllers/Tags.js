import Tag from "../models/Tag.js"


export const createTag = async(req,res)=>{
    try {
        const {name,description} = req.body
        if(!name ||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create tags entry
        const tagsDetails = await Tag.create({
            name:name,
            description:description
        })
        console.log(tagsDetails)

        return res.status(200).json({
            success:false,
            messgage:"Tag created succesfully"
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get all tags
export const showAllTags = async(req,res)=>{
    try {
        const allTags =  await Tag.find({},{name:true,description:true})
             return res.status(200).json({
            success:false,
            messgage:"All tags returned succesfully"
        })
        
    } catch (error) {
           return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get tag page details
export const getTagDetails = async(req,res)=>{
    try {
        //get id
        const {tagId} = req.body
        //get courses for specified tagId
        const selectedTag = await Tag.findById(tagId).populate("courses").exec()
        if(!selectedTag){
            return res.status(400).json({
                success:false,
                message:"Data not found"
            })
        }

        //get courses for different categories
        const differentTags = await Tag.find({_id:{$ne:tagId}}).populate("courses").exec()

        return res.status(200).json({
            success:true,
            data:{
                selectedTag,
                differentTags
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}