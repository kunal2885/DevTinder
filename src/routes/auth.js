const express = require("express")
const authRouter = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const validator = require("validator")
const {validateSignup} = require("../utils/validator")

authRouter.post("/signup",async (req,res)=>{
    //validate the data of signup api
    try{
    const {firstname, lastname , emailid ,password} = req.body
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        firstname,
        lastname,
        emailid,
        password : passwordHash

    })
    //hashing the password

    
        validateSignup(req)

        await user.save()
        res.send("user added successfully")
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
        res.send("login successful")
    }
    else{
        res.send("invalid credentials")
    }

    }catch(err){
        res.status(400).send("Error:  " + err.message)
    }
})

module.exports = authRouter