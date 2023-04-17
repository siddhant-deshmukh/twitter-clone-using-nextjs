import mongoose, { Types } from "mongoose";
import { IMedia } from "./Media";

export interface ITweetAttachments {
  content_type: "media" | "tweet" | null,
  media?: Types.ObjectId[],
  tweet?: Types.ObjectId,
}
export interface ITweetCreate {
  parent_tweet?: Types.ObjectId | null | string,
  text: string,
  author: Types.ObjectId | string,
  tweet_attachment : Types.ObjectId,
  
}
export interface ITweetStored extends ITweetCreate {
  _id: Types.ObjectId | string,
  time: Date,

  media? : Types.ObjectId[],

  num_views: number,
  num_comments: number,
  num_quotes: number,
  num_likes: number,
  num_retweet: number,
}

export interface ITweet {
  _id: string,
  parent_tweet?: null | string,
  text: string,
  tweet_attachment : Types.ObjectId,

  author: string,
  time: string,

  num_views: number,
  num_comments: number,
  num_quotes: number,
  num_likes: number,
  num_retweet: number,

  // authorDetails: {
  //   _id: string,
  //   name: string,
  //   user_name: string,
  //   avatar?: string,
  //   about?: string
  // },
  media? : IMedia[],
  have_retweeted?: boolean,
  have_liked?: boolean,
}


const contentSchema = new mongoose.Schema<ITweetAttachments>({
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" },
}, { _id: false })

const TweetSchema = new mongoose.Schema<ITweetStored>({
  author: { type: mongoose.Schema.Types.ObjectId, required: true, index:true },
  parent_tweet: { type: mongoose.Schema.Types.ObjectId, sparse: true },
  text: { type: String, maxlength: 400, default: "" },

  tweet_attachment: { type: mongoose.Schema.Types.ObjectId},
  media: [{ type: mongoose.Schema.Types.ObjectId }],

  time: { type: Date, required: true, default: Date.now(), index:true },
  num_views: { type: Number, default: 0 },
  num_likes: { type: Number, default: 0 },
  num_retweet: { type: Number, default: 0 },
  num_quotes: { type: Number, default: 0 },
  num_comments: { type: Number, default: 0 }
})

const Tweet = mongoose.models.Tweet || mongoose.model<ITweetStored>("Tweet", TweetSchema);
export default Tweet 