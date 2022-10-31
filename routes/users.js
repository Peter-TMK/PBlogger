const express = require('express')
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js")
const PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY
// Get User by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
});

// Get All Users
router.get("/", async (req, res) => {
    try{
        const users = await User.find();
        // const users = query
        // ? await userModel.find().sort({ _id: -1 }).limit(5)
        // : await userModel.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err)
    }
});

// Update
router.put("/:id", async (req, res)=> {
    if (req.body.userId === req.params.id) {
        if(req.body.password){
            // const salt = await bcrypt.genSalt(10);
            req.body.password = CryptoJS.AES.encrypt(req.body.password, PASSWORD_SECRET_KEY).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only update your account!")
    }
});


// Delete User and All Posts
router.delete("/:id", async (req, res)=> {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try{
                // The line below deletes users posts
                await Post.deleteMany({ username: user.username });
                // The line above deletes users posts
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted!");
        } catch (err) {
            res.status(500).json(err);
         }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only delete your account!")
    }
});

module.exports = router