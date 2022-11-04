const express = require('express')
const router = express.Router();
// const User = require("../model/User");
const readTime = require("./readTime")
const Post = require("../model/Post");
const { verifyToken } = require('./verifyToken');
// const { count } = require('../model/Post');

// Create Post
router.post("/", verifyToken, async (req, res) => {
    const newPost = new Post(req.body);
    try {
        newPost.reading_time = readTime(newPost.body)
        await newPost.save();
        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Post by ID
router.get("/:id", verifyToken, async (req, res) => {
    // try {
        // let post;
        const post = await Post.findById(req.params.id).populate("owner");
        if(!post){
            return res.status(404).send('Post not found!')
        }
        post.reading_time = readTime(post.body)
        post.read_count += 1;
        await post.save();

        res.status(200).json(post);
    // } catch (err) {
    //     res.status(500).json(err)
    // }
});


// // Get Post by username
// router.get("/:username", verifyToken, async (req, res) => {
//     // try {
//         // let post;
//         const post = await Post.findById(req.params.id);
//         if(!post){
//             return res.status(404).send('Post not found!')
//         }
//         post.read_count += 1;
//         await post.save();

//         res.status(200).json(post);
//     // } catch (err) {
//     //     res.status(500).json(err)
//     // }
// });

// Get All Posts or Search by Title, author or tag
// router.get("/", verifyToken, async (req, res) => {
//     const title = req.query.title;
//     const author = req.query.author;
//     const tag = req.query.tag;
//     try{
//         let posts;
//         if(title){
//             posts = await Post.find({ title });
//         } else if(author){
//             posts = await Post.find({ author }).sort({ _id: -1 }).limit(20);
//         } else if(tag){
//             posts = await Post.find({
//                 tags: {
//                     $in: [tag],
//                 },
//             }).sort({ _id: -1 }).limit(20);
//         } else {
//             posts = await Post.find().sort({ _id: -1 }).limit(20);
//         }
//         // posts.reading_time = readTime(posts.body)
//         res.status(200).json(posts);
//     } catch(err){
//         res.status(500).json(err);
//     }
// })

// Get All Posts or Search by Title, author or tag
router.get("/", verifyToken, async (req, res) => {
    const title = req.query.title;
    const author = req.query.author;
    const tag = req.query.tag;
    const state = req.query.state;
    const { page=1, limit=20 } = req.query;
    try{
        let posts;
        if(title){
            posts = await Post.find({ title });
        } else if(author){
            posts = await Post.find({ author }).sort({ _id: -1 }).limit(limit*1).skip((page-1)*limit).exec();
        } else if(state){
            posts = await Post.find({ state }).sort({ _id: -1 }).limit(limit*1).skip((page-1)*limit).exec();
        } else if(tag){
            posts = await Post.find({
                tags: {
                    $in: [tag],
                },
            }).sort({ _id: -1 }).limit(limit*1).skip((page-1)*limit).exec();
        } else {
            posts = await Post.find().sort({ reading_time: -1 }).limit(limit*1).skip((page-1)*limit).exec();
            
        }
        // posts.reading_time = readTime(posts.body)
        const count = await Post.countDocuments();
        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch(err){
        res.status(500).json(err);
    }
})

// // Get Published Post
// router.get("/pub", async (req, res) => {
//     // try {
//         // let post;
//         const post = await Post.find({ state: "published"});
//         if(!post){
//             return res.status(404).send('Post not found!')
//         }
//         // post.reading_time = readTime(post.body).toString() + " minute(s) read"
            
//         // await post.save();
//         res.status(200).json(post);
        
//     // } catch (err) {
//     //     res.status(500).json(err)
//     // }
// });
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
router.put("/:id", verifyToken, async (req, res)=> {
   try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
          $set: req.body
        },
        {new: true}
        );
        res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
});


// Delete Post
router.delete("/:id", verifyToken, async (req, res)=> {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router