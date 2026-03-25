const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        minLength : 4,
        maxLength: 55,
        lowercase : true,
        
    },
    lastname : {
        type : String,
        validate(value){
            if(["!","@","&","%","*"].some(item => value.includes(item))){
                throw new Error("enter valid lastname")
            }
        }
    },
    emailid : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18,
        max : 90
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("enter the right gender please")
            }
        }

    },
    skills :{
        type : [String,],

    },
    photourl :{
        type : String,
        default : "https://www.freepik.com/free-photos-vectors/profile"

    }
    
},{
    timestamps : true
})

module.exports = mongoose.model("User",userSchema)