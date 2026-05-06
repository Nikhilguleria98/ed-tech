import Section from '../models/Section.js'
import Course from '../models/Course.js'
import SubSection from '../models/SubSection.js'

export const createSection = async(req,res)=>{
    try {

        //data fetch
        const {sectionName,courseId}= req.body       
        
        //data validation
        if(!sectionName ||!courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create section
        const newSection = await Section.create({sectionName})

        //update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                                  {
                                                                    $push:{
                                                                       courseContent:newSection._id 
                                                                    }
                                                                  },
                                                                  {new:true}
          
                                                                   )
    
        //return response  
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails
        })        

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section ! please try again",
            error:error.message
        })   
    }
}

export const updateSection = async(req,res)=>{
    try {

                //data fetch
                const {sectionName,sectionId}= req.body       
        
                //data validation
                if(!sectionName ||!sectionId){
                    return res.status(400).json({
                        success:false,
                        message:"All fields are required"
                    })
                }

                //update data
                const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})

                //return response
                return res.status(200).json({
                    success:true,
                    message:"Section updated successfully",
                    section
                })   
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section ! please try again",
            error:error.message
        })   
    }
}


export const  deleteSection = async(req,res)=>{
    try {

        //get id
        const {sectionId} = req.params

        const section = await Section.findById(sectionId)
        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }

        await Course.updateMany(
            { courseContent: sectionId },
            { $pull: { courseContent: sectionId } }
        );
        await SubSection.deleteMany({ _id: { $in: section.subSection || [] } });
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section",
            error:error.message
        })
    }
}
