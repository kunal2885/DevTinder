require("dotenv").config();

const express = require("express")
const connectDb = require("./config/database")
const app = express()
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user")
const cors = require("cors")


app.use(cors({
    origin : "http://localhost:5173",
    credentials : true

}))
app.use(express.json())
app.use(cookieParser())
app.use("/",authRouter,profileRouter,requestRouter,userRouter)




connectDb().then(()=>{
    console.log("Database connected successfully")
    

    app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
}).catch((err)=>{
    console.error("Database did not connect")
})


