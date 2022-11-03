const mongoose = require('mongoose')

const Schema = mongoose.Schema
const PostSchema = new Schema({
    title: { type: String, required: true, unique: true },
    // username: { type: String, required: true, unique: true },
    description: { type: String },
    tags: { type: Array },
    author: { type: String },
    state: { type: String, enum: ['draft', 'published'], default: 'draft'},
    read_count: { type: Number, default: 0 },
    reading_time: { type: String },
    body: { type: String, required: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema)
