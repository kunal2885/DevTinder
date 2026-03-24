const express = require("express")
const connectDb = require("./config/database")
const User = require("./models/user")
const app = express()

app.use(express.json())
// POST /signup api
app.post("/signup",async (req,res)=>{
    //console.log(req.body)
    const user = new User(req.body)
    try{
        res.send("user added successfully")
        await user.save()
    }
    catch(err){
        res.status(400).send("error while adding the user")
    }
})

//GET /user api
app.get("/user",async (req,res)=>{
    const userName = req.body.firstname
    
    try{
        const users = await User.find({firstname : userName})
        if(users.length === 0){
            res.status(404).send("user not found")
        }
        else{
            res.send(users)
        }

    }catch(err){
        res.status(400).send('something went wrong')
    }
})

// GET /feed api
app.get("/feed",async (req,res)=>{
    try{
    const users = await User.find({})
    res.send(users)
    }catch(err){
        res.status(400).send("something went wrong")
    }
    
})

// DELETE /user api

app.delete("/user", async (req,res)=>{
    const userId = req.body.userId
    console.log(userId)
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send("user deleted successfully")
    }catch(err){
        res.status(400).send("something went wrong")
    }

})

// PATCH /user api

app.patch("/user", async (req,res)=>{
    const data = req.body
    const userId = req.body.userId
    try{
        //await User.findOneAndUpdate({_id : userId},data)
        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument : "after"
        })
        console.log(user)
        res.send("user updated successfully")
    }catch(err){
        res.status(400).send('something went wrong')
    }
})



connectDb().then(()=>{
    console.log("Database connected successfully")
    app.listen(8088,()=>{
    console.log("server is up and listening to requests on port 8088")
})
})
.catch((err)=>{
    console.error("Database did not connect")
})


