const express = require("express")
const authRouter = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const validator = require("validator")
const {validateSignup} = require("../utils/validator")
const crypto = require("crypto")

authRouter.post("/signup",async (req,res)=>{
    //validate the data of signup api
    try{
    validateSignup(req)
    const {firstname, lastname , emailid ,password} = req.body
    //hashing the password
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        firstname,
        lastname,
        emailid,
        password : passwordHash

    })
    
        

        const savedUser = await user.save()
        const token = await user.getJWT()
        res.cookie("mycookie",token,{expires : new Date(Date.now() + 24 * 3600000)})

        return res.json({message :"user added successfully",data : savedUser})
    }
    catch(err){
        res.status(400).send("error while adding the user " + err.message)
    }
})

authRouter.post("/login", async (req,res)=>{
    try{
    const {emailid, password} = req.body
    if(!validator.isEmail(emailid)){
        throw new Error("invalid emailid")
    }
    const user = await User.findOne({emailid : emailid})
    if(!user){
        throw new Error("invalid credentials")
    }
    const isPasswordCorrect = await user.validatePassword(password)
    if(isPasswordCorrect){
        //create a JWT token
        const token = await user.getJWT()

        //add that token to cookie and sends back the response
        res.cookie("mycookie",token,{expires : new Date(Date.now() + 24 * 3600000)})
        res.send(user)
    }
    else{
        res.send("invalid credentials")
    }

    }catch(err){
        res.status(400).send("Error:  " + err.message)
    }
})


authRouter.post("/logout",(req,res)=>{
    res.cookie("mycookie",null,{
        expires : new Date(Date.now())
    }) 
    res.send("logged out successfuly")
})

authRouter.post("/forgot-password", async (req,res)=>{
    const {emailid ,  newPassword} = req.body
    const token = req.body.token?.trim();
    //phase 1 : generation of token , if email is given
    try{if(emailid){
        const user = await User.findOne({emailid})
        if(!user){
            return res.status(400).json({message : "your email is not registered, please signup"})
        }
        
        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetTokenExpiry = Date.now() + 30 * 60* 1000
        user.resetToken = resetToken
        user.resetTokenExpiry = resetTokenExpiry
        await user.save()
        return res.json({
            message : "token generated",
            token : resetToken
        })

    }
    //phase 2 : resetting of password
    if(token && newPassword) {
        const user = await User.findOne({resetToken : token,
            resetTokenExpiry : {$gt : Date.now()}
        } )
        if(!user){
            return res.status(400).json({message : "token expired"})
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        user.resetToken = undefined
        user.resetTokenExpiry = undefined
        await user.save()
        return res.json({message : "password successfully reseted"})
    }
     return res.status(400).json({
      message: "Provide either email OR token + newPassword"
    });
}catch(err){
    res.status(500).json({ message: "Something went wrong" });
}



})


module.exports = authRouter