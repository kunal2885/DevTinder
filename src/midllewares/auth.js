const jwt = require("jsonwebtoken")
const User = require("../models/user")
const userAuth =  async (req,res,next)=>{
    try{const {mycookie} = req.cookies
    if(!mycookie){
        throw new Error("Please login!!!")
    }
    const decodedData = await jwt.verify(mycookie,"MyDevTinder28Token")
    const user = await User.findById(decodedData._id)
    if(!user){
        throw new Error("User not found")
    }
    req.user= user
    next()}
    catch(err){
        res.status(400).send("Error:" + err.message)
    }
    
}

module.exports = {userAuth}