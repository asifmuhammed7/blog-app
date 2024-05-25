import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import generateTokenAndCookie from "../utils/generateToken.js";
export const signup = async (req,res)=>{
    try {
        const {username,email,password,confirmPassword} = req.body;
        if(password!== confirmPassword) {
            res.status(400).json({error:"passwords don't match"})
        }
        const user = await User.findOne({email})
        
        if(user){
            return res.status(400).json({error:"user already exists"});
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            username,
            email,
            password:hashedPassword,

        })
        if(newUser){
            generateTokenAndCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username
            })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup")
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const login= async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")
        if(!user || !isPasswordCorrect){
           return res.status(400).json({error:"Invalid username or password"})
        }
        generateTokenAndCookie(user._id,res);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    } catch (error) {
        console.log("error in login controller");
        res.status(500).json({error:"Internal server error"})
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(201).json({message:"Logout Sucessfully"})    
    } catch (error) {
        console.log("error in logout");
        res.status(500).json({error:"Internal server error"})
    }
}