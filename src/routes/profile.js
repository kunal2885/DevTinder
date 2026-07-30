const express = require("express")
const profileRouter = express.Router()
const {userAuth} = require("../midllewares/auth")
const {validateEditRequest}= require("../utils/validator")

profileRouter.get("/profile/view",userAuth, async (req,res)=>{
    try{
        const user = req.user
        res.send(user)
   
    }    
    
    catch(err){
        res.status(400).send("Please Login")
    }
})
profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{
        if(!validateEditRequest(req)){
            throw new Error("Enter valid fields to update")
        }
        const loggedInUser = req.user
        
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]) 
        await loggedInUser.save()
        res.json({
        message: "You have been updated successfully",
        updatedprofile: loggedInUser
        });
        

    }catch(err){
        res.status(400).send("Error:  " + err.message)
    }
})

module.exports = profileRouter