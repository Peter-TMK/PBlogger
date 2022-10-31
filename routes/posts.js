const express = require('express')
const router = express.Router();
// const User = require("../model/User");
const Post = require("../model/Post");

// Create Post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Post by ID
router.get("/:id", async (req, res) => {
    // try {
        // let post;
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).send('Post not found!')
        }
        post.read_count += 1;
        await post.save();

        res.status(200).json(post);
    // } catch (err) {
    //     res.status(500).json(err)
    // }
});

// Get All Posts
// router.get("/", async (req, res) => {
//     try{
//         const posts = await Post.find();
//         // const users = query
//         // ? await userModel.find().sort({ _id: -1 }).limit(5)
//         // : await userModel.find();
//         res.status(200).json(posts);
//     } catch(err) {
//         res.status(500).json(err)
//     }
// });

// Get All Posts or Search by Title, author or tag
router.get("/", async (req, res) => {
    const title = req.query.title;
    const author = req.query.author;
    const tag = req.query.tag;
    try{
        let posts;
        if(title){
            posts = await Post.find({ title });
        } else if(author){
            posts = await Post.find({ author });
        } else if(tag){
            posts = await Post.find({
                tags: {
                    $in: [tag],
                },
            });
        } else {
            posts = await Post.find().sort({ _id: -1 }).limit(20);
        }
        res.status(200).json(posts);
    } catch(err){
        res.status(500).json(err);
    }
})

// ================================================================
// userRoute.get("/", verifyTokenAndAdmin, async (req, res) => {
//     const query = req.query.new;
//     try{
//         const users = query
//         ? await userModel.find().sort({ _id: -1 }).limit(5)
//         : await userModel.find();
//         res.status(200).json(users);
//     } catch(err) {
//         res.status(500).json(err)
//     }
// });
// ================================================================


// Update Post
router.put("/:id", async (req, res)=> {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try{
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                    $set: req.body
                },{new:true}
                );
                res.status(200).json(updatedPost);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can update only your post!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
});


// Delete Post
router.delete("/:id", async (req, res)=> {
    try {
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try{
                await Post.deleteOne();
                res.status(200).json("Post has been deleted!");
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can delete only your post!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router