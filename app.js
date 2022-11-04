const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const { connectToMongoDB } = require('./db')
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const pubRoute = require("./routes/publishedPosts")

connectToMongoDB()

// middleware
app.use(express.json());
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/pubPosts", pubRoute)

// routes
// const UserControls = require("./controllers/UserController");
// // const PostControls = require("./controllers/UserController");
// app.get("/users", UserControls.all);
// app.get("/users/create", UserControls.create);
// app.get("/users/:username", UserControls.find);
// app.get("/users/:username/posts", UserControls.getAllPosts);

app.listen(PORT || 7000, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})