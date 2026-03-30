const express = require("express")
const requestRouter = express.Router()
const {userAuth} = require("../midllewares/auth")


requestRouter.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    //connection send logic
    console.log("sending connection request")
    res.send("connection request sent")
})

module.exports = requestRouter