const mongoose = require("mongoose")
console.log(process.env.DB_CONNECTION_STRING)

const connectDb = async ()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

module.exports = connectDb

