const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
    // parent_tweet:mongoose.Types.ObjectId,
    author: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    parent_tweet: { type: mongoose.Schema.Types.ObjectId, required: true, index: true  },
    type: { type: String,  enum: ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"] },
    key: { type: String },
    url: { type: String, required: true },
    uploaded: { type: Boolean, default: false },
    size: { type: Number, max: 2097152}, // 2MB
})
const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema);
module.exports =  Media