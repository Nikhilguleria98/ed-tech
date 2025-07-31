import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
dotenv.config()

const app = express()

//port
const PORT = process.env.PORT

//database
connectDB()

//server
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

