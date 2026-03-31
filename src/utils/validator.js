//all the validation logic 
const validator = require("validator")
const validateSignup = (req)=>{
    const {firstname, lastname , emailid ,password} = req.body
    if(!firstname || !lastname){
        throw new Error("enter your correct first and lastname")
    }
    else if(!validator.isEmail(emailid)){
        throw new Error("enter a valid email")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("enter a strong password")
    }

}
const validateEditRequest = (req)=>{
    //allowed fields are : 
    const allowedFields = ["firstname","lastname","age","gender","skills","photourl"]
    const isUpdateAllowed = Object.keys(req.body).every(key => allowedFields.includes(key)) 
    return isUpdateAllowed
}
module.exports = {validateSignup,validateEditRequest}