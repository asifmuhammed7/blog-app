import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import connectToMongoDB from './db/connectToMongoDB.js';
const PORT = process.env.PORT || 5000;
dotenv.config()
 
const app = express();   
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes) 
app.listen(PORT,()=>{
    connectToMongoDB()
    console.log(`Server Running on Port ${PORT}`);
});  