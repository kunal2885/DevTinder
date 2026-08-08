const cron = require("node-cron");
const {subDays , startOfDay , endOfDay} = require("date-fns")
const ConnectionRequestModel = require("../models/connectionRequest")
const sendEmail = require("./sendEmail")


cron.schedule("0 8 * * *", async ()=>{
    try{
        const yesterday = subDays(new Date(), 1)
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)
        

        const pendingRequests = await ConnectionRequestModel.find({
            status : "interested",
            createdAt : {
                $gte : yesterdayStart,
                $lt : yesterdayEnd,
            },
        }).populate("fromUserId toUserId")

        const list_of_emails = [... new Set(pendingRequests.map((req) => req.toUserId.emailid))]
        
        for( const email of list_of_emails){
            try{
                const res = await sendEmail.run("New Connection Requests pending for " + email,
                "There are so many frined reuests pending, please login to DevMatch.in and accept or reject the requests.")
                console.log(res)
            }
            catch(err){
                console.log(err)
            }
        }   



    }
    catch(err){
        console.log(err)
    }
})