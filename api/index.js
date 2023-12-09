
import express from "express"
import dotenv from 'dotenv'
import mongoose from "mongoose";
import useRouter from './routes/user.route.js'
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js"

dotenv.config();






mongoose
.connect(process.env.MONGO).then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.log("err")
})

const app = express();

app.use(express.json())

app.use(cookieParser())


app.listen(3000 , ()=>{
    console.log("server is run ...")
})


app.use("/api/user" , useRouter )
app.use("/api/auth" , authRouter )
app.use("/api/listing" , listingRouter)




// my middleware to handleerror
app.use((err,req,res,next)=>{

const statusCode = err.statusCode || 500;
const message = err.message || "internal server error";
return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
})

})