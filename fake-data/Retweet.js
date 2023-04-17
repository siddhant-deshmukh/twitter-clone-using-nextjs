const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    time: { type: Date, default : Date.now() },
    quoted : mongoose.Schema.Types.ObjectId
})
const Retweet = mongoose.models.Retweet || mongoose.model("Retweet", mediaSchema);
module.exports = Retweet