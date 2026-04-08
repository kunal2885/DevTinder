const mongoose = require('mongoose')
const connectionRequestSchema = new mongoose.Schema({
    fromUserId :{
        type : mongoose.Types.ObjectId,
        required : true
    },
    toUserId :{
        type : mongoose.Types.ObjectId,
        required : true

    },
    status :{
        type : String,
        enum :{
            values : ["ignored","interested","accepted","rejected"],
            message: `{VALUE} is not a valid entry`

        }
    }

},{
    timestamps: true
})

connectionRequestSchema.index = {fromUserId : 1 , toUserId : 1}

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you can't send connection to yourself!!!")
    }
    next()
    
})

const ConnectionRequestModel =  mongoose.model("ConnectionRequestModel",connectionRequestSchema )

module.exports = ConnectionRequestModel