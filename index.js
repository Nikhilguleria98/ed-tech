import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

//port
const PORT = process.env.PORT

//server
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

