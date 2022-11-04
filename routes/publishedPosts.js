const express = require('express')
const router = express.Router();
// const User = require("../model/User");
const readTime = require("./readTime")
const Post = require("../model/Post");
// const { verifyToken } = require('./verifyToken');

// Get a list of Published Post
// router.get("/", async (req, res) => {
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

// Get All Posts or Search by Title, author or tag
router.get("/", async (req, res) => {
    const title = req.query.title;
    const author = req.query.author;
    const tag = req.query.tag;
    const sort = req.query.sort
    const { page=1, limit=20 } = req.query;
    try{
        const ValidSort = ['read_count', 'reading_time', 'timestamp'].includes(sort)
        ValidSort ? null : sort = 'read_count'
        let posts;
        if(title){
            posts = await Post.find({ title });
        } else if(author){
            posts = await Post.find({ author }).find({ state: "published"}).sort({ _id: -1 }).limit(limit*1).skip((page-1)*limit).exec();
        } else if(tag){
            posts = await Post.find({
                tags: {
                    $in: [tag],
                },
            }).find({ state: "published"}).sort({ _id: -1 }).limit(limit*1).skip((page-1)*limit).exec();
        } else {
            posts = await Post.find({ state: "published"}).sort({ [sort]: -1 }).limit(limit*1).skip((page-1)*limit).exec();
            
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

// Get Published Post byId
// router.get("/:id", async (req, res) => {
//     // try {
//         // let post;
//         const post = await Post.findById(req.params.id).find({ state: "published"});
//         if(!post){
//             return res.status(404).send('Post not found!')
//         }
//         // post.reading_time = readTime(post.body).toString() + " minute(s) read"
            
//         // post.reading_time = readTime(post.body)
//         post.read_count += 1;
//         await post.save();

//         res.status(200).json(post);
        
//     // } catch (err) {
//     //     res.status(500).json(err)
//     // }
// });
// router.get("/:id", verifyToken, async (req, res) => {
//     // try {
//         // let post;
//         const post = await Post.findById(req.params.id);
//         if(!post){
//             return res.status(404).send('Post not found!')
//         }
//         post.reading_time = readTime(post.body).toString() + " minute(s) read"
//         post.read_count += 1;
//         await post.save();

//         res.status(200).json(post);
//     // } catch (err) {
//     //     res.status(500).json(err)
//     // }
// });

// router.get("/:id", verifyToken, async (req, res) => {
//     // try {
//         // let post;
//         const post = await Post.findById(req.params.id);
//         if(!post){
//             return res.status(404).send('Post not found!')
//         }
//         post.reading_time = readTime(post.body).toString() + " minute(s) read"
//         post.read_count += 1;
//         await post.save();

//         res.status(200).json(post);
//     // } catch (err) {
//     //     res.status(500).json(err)
//     // }
// });
module.exports = router