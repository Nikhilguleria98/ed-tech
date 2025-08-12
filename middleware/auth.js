import jwt from 'jsonwebtoken'

export const auth = async(req,res,next)=>{
    try {

        //extract token
        const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer ","")

        //check token missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }
        
        //verify token
        try {

             const decode = jwt.verify(token,process.env.JWT_SECRET)
             console.log(decode)
             req.user = decode
            
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        next()
    } catch (error) {
             return res.status(401).json({
                success:false,
                message:"Something went wrong while validating token"
            })
    }
}

//isStudent

export const isStudent =async(req,res)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for students only"
            })
        }
        
    } catch (error) {
              return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again"
            })
    }
}

//isInstructor
export const isInstructor =async(req,res)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor only"
            })
        }
        
    } catch (error) {
              return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again"
            })
    }
}

//isAdmin
export const isAdmin =async(req,res)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only"
            })
        }
        
    } catch (error) {
              return res.status(500).json({
                success:false,
                message:"User role cannot be verified, please try again"
            })
    }
}