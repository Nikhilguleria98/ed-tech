import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('databse connected successfully')
        
    } catch (error) {
        console.log('db connection error')
    }
}

export default connectDB