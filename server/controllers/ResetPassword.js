import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from 'bcrypt'

export const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne(email);
    if (!user) {
      return res.status(401).json({
        message: "Your email is not registered",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`

    //send email
    await mailSender(email,
        'Passsword reset Link'
        `Password reset link: ${url}`
    )

    return res.json({
        message:"Password reset link sent successfully ,please check email and change password"
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Error occured while sending the password reset link"
    })
  }
};


// reset password
export const restPassword = async(req,res)=>{
    try {
        const {password,confirmPassword,token} =req.body

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password does not match please try again"
            })
        }

        const userDetails = await User.findOne({token:token})
        if(!userDetails){
            return res.json({
                message:"Invalid token"
            })
        }

        //token expiration time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10)

        //password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:false,
            message:"Password reset sucessfully"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset password"
        })
    }
}