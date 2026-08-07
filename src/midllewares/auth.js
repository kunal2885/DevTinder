const jwt = require("jsonwebtoken")
const User = require("../models/user")
const userAuth =  async (req,res,next)=>{
    try{
    const {mycookie} = req.cookies
    if(!mycookie){
        return res.status(401).send("Please login")
    }
    const decodedData = await jwt.verify(mycookie,process.env.JWT_SECRET)
    const user = await User.findById(decodedData._id)
    if(!user){
        throw new Error("User not found")
    }
    req.user= user
    next()}
    catch (err) {
        
        res.status(400).send(err.message);
    }
    
}

module.exports = {userAuth}