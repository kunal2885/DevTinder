const socket = require("socket.io")

const getSecretRoomId = (targetUserId , userId)=>{
    return [targetUserId , userId].sort().join("$")
}

const initializeSocket = (server)=>{
    const io = socket(server,{
        cors: {
            origin : "http://localhost:5173",
        }

    })
    io.on("connection",(socket)=>{
        //event handler
        
        socket.on("joinChat",({firstname , userId , targetUserId})=>{
            const roomId = getSecretRoomId(targetUserId , userId)
            console.log(firstname + "joined : " + roomId)
            socket.join(roomId)
        })

        socket.on("sendMessage",({firstname , lastname , userId , targetUserId , text})=>{
            const roomId = getSecretRoomId(targetUserId , userId)
            console.log(firstname + "messaged : " + text)
            io.to(roomId).emit("messageReceived", {firstname , lastname , text})

        })

        socket.on("disconnect",()=>{})

    })

}

module.exports = initializeSocket 