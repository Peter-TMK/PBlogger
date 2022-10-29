// this contains code to hold the mongodb online instance
const mongoose = require("mongoose")
require("dotenv").config()

const MONGO_URL = process.env.MONGO_URL


//checking the connection
function connectToMongoDB(){
    mongoose.connect(MONGO_URL)
        // .then(()=>{
        //     console.log('connected to compass db successfully!')
        // })

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB Successfully!");
    });

    mongoose.connection.on("error", (err) => {
        console.log("An error occurred while connecting to MongoDB");
        console.log(err);
    })
}

module.exports = {
    connectToMongoDB
}