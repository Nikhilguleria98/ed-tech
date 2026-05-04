import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cookieParser from "cookie-parser"
import cors from 'cors'
import fileUpload from 'express-fileupload' 
import { cloudinaryConnect } from './config/cloudinary.js'
import userRoutes from './routes/userRoutes.js'
import courseRoutes from './routes/coursesRoutes.js'
import tagRoutes from './routes/tagRoutes.js'

dotenv.config()

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))

//routes 
app.use("/", userRoutes)
app.use("/course",courseRoutes)
app.use("/tag", tagRoutes);


//database
connectDB()

//cloudinary 
cloudinaryConnect()

//port
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})