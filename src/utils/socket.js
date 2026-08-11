const socket = require("socket.io")

const initializeSocket = (server)=>{
    const io = socket(server,{
        cors: {
            origin : "http://localhost:5173",
        }

    })
    io.on("connection",(socket)=>{
        //event handler
        
        io.on("joinChat",()=>{})

        io.on("sendMessage",()=>{})

        io.on("disconnect",()=>{})

    })

}

module.exports = initializeSocket 