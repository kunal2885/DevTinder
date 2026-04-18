const express = require("express")
const connectDb = require("./config/database")
const app = express()
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user")
const PORT = process.env.PORT || 8088;

app.use(express.json())
app.use(cookieParser())
app.all("/",(req,res,next)=>{
    res.send("The frontend of DevTinder is in development . So please test the apis in postman. Here is the list of apis with their url and description : <br> 1. POST /signup api- <br> This api takes firstname,lastname,emailid and password in the request body and registers the user on DevTinder. <br> 2.POST /login api- <br> This api logins the user and takes emailid and password in request body. <br> 3.POST /logout api -<br> This api logouts the loggedin user. <br> 4. POST /request/send/:status/:userId api - <br> This sends the connection request to a user and the status can be either interested or ignored. <br> 5. POST /request/review/:status/:requestId - <br> This api is used to review the requests that a user has received . The user can accept or reject the connection request. <br> 6. GET /profile/view - <br> It return the information of the loggedin user in json format.<br> 7. PATCH /profile/edit - <br> This api is used to update the information of user such as firstname,lastname,skills,photurl but can't edit email and password. <br> 8. GET /user/connections/received api- <br> It is used to fetch the connection requests that a user has received.<br> 9. GET /user/connections -<br> It fetches the all of the connections of the logeedin user <br> 10. GET /feed - <br> It is the feed api and pagination has also been implemented. This api fetches the users from the database that are not in connections of loggedinuser, the logeedinuser has not interested or ignored their profile and they also have not seen the loggedin user profile. we can also sepcify page and limit for paginatio<br>  ")
    next()
})
app.use("/",authRouter,profileRouter,requestRouter,userRouter)




connectDb().then(()=>{
    console.log("Database connected successfully")
    

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
}).catch((err)=>{
    console.error("Database did not connect")
})


