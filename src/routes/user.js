const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../midllewares/auth")
const ConnectionRequestModel = require("../models/connectionRequest")

//to get all the pending connections of the logged in user
userRouter.get("/user/connections/received",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const connectionrequests = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId","firstname lastname skills photurl about age gender")
        res.json({message : "fetched the pending connection requests      successfully",
            data : connectionrequests
        })

    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})


module.exports = userRouter