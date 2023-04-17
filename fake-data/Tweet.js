const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema({
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" },
}, { _id: false })

const TweetSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  parent_tweet: { type: mongoose.Schema.Types.ObjectId, sparse: true },
  text: { type: String, maxlength: 400, default: "" },

  tweet_attachment: { type: mongoose.Schema.Types.ObjectId },
  media: [{ type: mongoose.Schema.Types.ObjectId }],

  time: { type: Date, required: true, default: Date.now(), index: true },
  num_views: { type: Number, default: 0 },
  num_likes: { type: Number, default: 0 },
  num_retweet: { type: Number, default: 0 },
  num_quotes: { type: Number, default: 0 },
  num_comments: { type: Number, default: 0 }

})

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
module.exports = Tweet