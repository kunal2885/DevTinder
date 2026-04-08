const express = require("express")
const requestRouter = express.Router()
const {userAuth} = require("../midllewares/auth")
const ConnectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user")


requestRouter.post("/request/send/:status/:userId",userAuth,async (req,res)=>{
    try{
    const fromUserId = req.user._id
    const toUserId = req.params.userId
    const status = req.params.status

    const allowedStatus = ["ignored","interested"]
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message : "invalid status entry",
            status
        })
    }

    //check whether the connection request already exist
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
       $or : [
        {fromUserId,toUserId},
        {fromUserId : toUserId, toUserId : fromUserId}
       ] 
    })
    if(existingConnectionRequest){
        return res.status(400).send({
            message : "connection request already exist"
        })
    }

    //checking whether the toUserId is a registered user
    const validReceiver = await User.findById(toUserId)
    if(!validReceiver){
        return res.status(400).send({
            message : "User in which your are interested does not exist"
        })
    }

    const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status
    })
    const data = await connectionRequest.save()
    res.json({
        message : req.user.firstname +" "+ status + " " +validReceiver.firstname,
        data : data
    })
}catch(err){
    res.status(400).send("Error :" + err.message)
}

    
})

module.exports = requestRouter