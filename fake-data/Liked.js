const mongoose = require('mongoose')


const mediaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    time: { type: Date, default : Date.now() }
})
const Like = mongoose.models.Like || mongoose.model("Like", mediaSchema);
module.exports = Like