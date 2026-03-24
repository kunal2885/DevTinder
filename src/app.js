const express = require("express")
const connectDb = require("./config/database")
const User = require("./models/user")
const app = express()

app.use(express.json())
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

connectDb().then(()=>{
    console.log("Database connected successfully")
    app.listen(8088,()=>{
    console.log("server is up and listening to requests on port 8088")
})
})
.catch((err)=>{
    console.error("Database did not connect")
})


