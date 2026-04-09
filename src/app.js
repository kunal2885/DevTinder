const express = require("express")
const connectDb = require("./config/database")
const app = express()
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user")

app.use(express.json())
app.use(cookieParser())
app.use("/",authRouter,profileRouter,requestRouter,userRouter)




connectDb().then(()=>{
    console.log("Database connected successfully")
    app.listen(8088,()=>{
    console.log("server is up and listening to requests on port 8088")
})
})
.catch((err)=>{
    console.error("Database did not connect")
})


