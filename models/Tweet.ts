import mongoose,{Types} from "mongoose";

export interface IPoll{
    parent_tweet : Types.ObjectId,
    options : [string],
    counting : [number],
    minutes_len:number //10080 max
}
export interface IContent{
    media? : [IMedia],
    gif? : string,
    poll? : IPoll,
    tweet? : Types.ObjectId,
}
export interface IMedia{
    type:"img" | "video", 
    url:string
}
export interface ITweet{
    author : Types.ObjectId,
    parent_tweet : Types.ObjectId | null,
    time : Date,
    num_views : number,
    text : string,
    tagged_people : [Types.ObjectId],
    num_comments : number,
    comment_tweets : [Types.ObjectId],
    num_quotes : number,
    quotes_tweets : [Types.ObjectId],
    num_likes : number,
    liked_by : [Types.ObjectId],
    num_retweet : number,
    retweet_by : [Types.ObjectId],
    who_can_reply : [Types.ObjectId] ,
    who_can_see : [Types.ObjectId] ,
    content : IContent
}
const pollSchema = new mongoose.Schema<IPoll>({
    options:[String],
    counting:[Number],
    minutes_len:{type:Number,max:10080}
},{_id:true})
const mediaSchema = new mongoose.Schema<IMedia>({
    type:String,
    url:String,
},{_id:false})
const contentSchema = new mongoose.Schema<IContent>({
    media:[mediaSchema],
    gif:String,
    poll:pollSchema,
    tweet:{type:mongoose.Schema.Types.ObjectId,ref:"Tweet"},
},{_id:false})

const TweetSchema = new mongoose.Schema<ITweet>({
    author : {type:mongoose.Schema.Types.ObjectId,required:true},
    parent_tweet : {type:mongoose.Schema.Types.ObjectId,required:true},
    text : {type:String,maxlength:400,default:""},
    time : {type: Date,required:true},
    num_views : {type: Number,default:0},
    num_likes : {type: Number,default:0},
    num_comments : {type: Number,default:0},
    num_retweet : {type: Number,default:0},
    num_quotes : {type: Number,default:0},
    liked_by : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    retweet_by : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    quotes_tweets : [{type:mongoose.Schema.Types.ObjectId,ref:"Tweet"}],
    comment_tweets : [{type:mongoose.Schema.Types.ObjectId,ref:"Tweet"}],
    tagged_people : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    who_can_reply : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    who_can_see : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    content : contentSchema
})

const Tweet = mongoose.models.Tweet || mongoose.model<ITweet>("Tweet", TweetSchema);
export default Tweet