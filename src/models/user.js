const mongoose = require("mongoose")
const validator = require("validator")

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
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("enter a valid email")
            }
        }

    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("please make a strong password")
            }
        }
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
        default : "https://www.freepik.com/free-photos-vectors/profile",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("enter a valid url")
            }
        }

    }
    
},{
    timestamps : true
})

module.exports = mongoose.model("User",userSchema)