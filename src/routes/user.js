const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../midllewares/auth")
const ConnectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user.js")
const SAFE_USER_DATA = "firstname lastname skills photourl about age gender"

//to get all the pending connections of the logged in user
userRouter.get("/user/connections/received",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const connectionrequests = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId",SAFE_USER_DATA)
        res.json({message : "fetched the pending connection requests      successfully",
            data : connectionrequests
        })
        

    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})
userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const connections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId : loggedInUser._id , status : "accepted"},
                {toUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId",SAFE_USER_DATA).populate("toUserId",SAFE_USER_DATA)
        
        const data = connections.map((individualDoc)=>{
            if(loggedInUser._id.equals(individualDoc.fromUserId._id)){
                return individualDoc.toUserId
            }
            return individualDoc.fromUserId
         })
        res.send({data})


    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }
})

userRouter.get("/user/feed",userAuth, async (req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1
        
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page-1)*limit
        const loggedInUser = req.user
        const hideConnections = await ConnectionRequestModel.find({
            $or : [{fromUserId : loggedInUser._id} , {toUserId : loggedInUser._id}]
        })
        const hideUsersFromFeed = new Set()
        hideConnections.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        
        
       const users = await User.find({
         $and : [ 
            { _id : {$nin : Array.from(hideUsersFromFeed)}},
            { _id : {$ne : loggedInUser._id} }
         ]
         }).select("firstname lastname skills photourl about age gender")
         .skip(skip)
         .limit(limit);
        res.send(users)


    }catch(err){
        res.status(400).json({message : err.message})
    }


})


module.exports = userRouter