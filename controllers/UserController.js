// const User = require("../model/User");
// // Get Post by username
// let Usercontroller = {
//     find: async (req, res) => {
//         let found = await User.find({
//             name: req.params.username
//         });
//         res.json(found)
//     },
//     all: async (req, res) => {
//         let allUsers = await User.find();
//         res.json(allUsers)
//     },
//     create: async (req, res) => {
//         let newUser = new User(req.body);
//         let savedUser = await newUser.save();
//         res.json(savedUser)
//     },
//     getAllPosts: async (req, res) => {
//         let foundUser = await User.find({
//             name: req.params.username
//         }).populate("posts");
//         res.json(foundUser)
//     }
// }

// module.exports = Usercontroller;