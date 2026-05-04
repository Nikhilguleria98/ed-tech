import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
dotenv.config()
import cookieParser from "cookie-parser"
import cors from 'cors'
import fileUpload from 'express-fileupload' 
import { cloudinaryConnect } from './config/cloudinary.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

//middlewares
app.use(express.json())
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

//port
const PORT = process.env.PORT

//routes
app.use("/",userRoutes)

//database
connectDB()

//cloudinary
cloudinaryConnect
//server
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

