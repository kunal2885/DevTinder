const express = require('express')
const mongoose = require("mongoose")
const {userAuth} = require("../midllewares/auth")
const {Chat} = require("../models/chat")
const chatRouter = express.Router()

chatRouter.get("/chat/:targetUserId" ,userAuth, async(req,res)=>{
    const { targetUserId } = req.params
    const userId = req.user._id

    try{
        let chat = await Chat.findOne({
            participants : { $all : [targetUserId , userId]}
        }).populate({
            path : "messages.senderId",
            select: "firstname lastname"
        })

        if(!chat){
            chat = new Chat({
                participants : [targetUserId , userId],
                messages : []
            })
        }
        await chat.save()

        res.json(chat)
    }
    catch(err){
        console.log(err)
    }

})

module.exports = chatRouter