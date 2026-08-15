const socket = require("socket.io")
const { Chat } = require("../models/chat")

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

        socket.on("sendMessage",async({firstname , lastname , userId , targetUserId , text})=>{
            try{
            const roomId = getSecretRoomId(targetUserId , userId)
            console.log(firstname + "messaged : " + text)

            let chat = await Chat.findOne({
                participants : { $all : [ userId , targetUserId]}
            })

            if(!chat){
                chat = new Chat({
                    participants : [userId , targetUserId],
                    messages : []
                })
            }
            chat.messages.push({
            senderId: userId,
            text,
          })

            await chat.save()


            io.to(roomId).emit("messageReceived", {firstname , lastname , text})}
            catch(err){
                console.log(err)
            }

        })

        socket.on("disconnect",()=>{})

    })

}

module.exports = initializeSocket 