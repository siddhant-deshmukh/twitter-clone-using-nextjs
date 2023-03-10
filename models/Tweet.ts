import mongoose,{Types} from "mongoose";
import { IMedia } from "./Media";
export interface IPoll{
    _id? : Types.ObjectId,
    parent_tweet : Types.ObjectId,
    options : [string],
    counting : [number],
    minutes_len:number //10080 max
}

export interface IGif {
    type:"image/gif",
    url:string,
    size:number,   
}
export interface IContent{
    content_type : "media"|"gif"|"poll"|"tweet"|"",
    media? : Types.ObjectId[],
    gif? : Types.ObjectId,
    poll? : IPoll,
    tweet? : Types.ObjectId,
}
export interface ITweetFileAttachments{
    content_type : "media"|"gif"|"poll"|"tweet"|"",
    media? : IMedia[],
    gif? :IMedia,
    poll? : IPoll,
    tweet? : Types.ObjectId,
}
export interface ITweetContent{
    _id?:string,
    parent_tweet : string | null,
    text : string,
    tagged_people : string[],
    content? : IContent,
    author? : string,
    authorDetails? : {
        _id : Types.ObjectId,
        name?:string,
        user_name:string,
        avatar?:string,
        about?:string
    },
    has_retweet? : boolean,
    has_liked?:boolean,
}
export interface ITweet extends ITweetContent{
   

    who_can_reply : [Types.ObjectId] ,
    who_can_see : [Types.ObjectId] ,

    time : Date,

    num_views : number,
    num_comments : number,
    comment_tweets? : [Types.ObjectId],
    num_quotes : number,
    quotes_tweets? : [Types.ObjectId],
    num_likes : number,
    liked_by? : [Types.ObjectId],
    num_retweet : number,
    retweet_by? : [Types.ObjectId],    
}

const pollSchema = new mongoose.Schema<IPoll>({
    options:[String],
    counting:[Number],
    minutes_len:{type:Number,max:10080}
},{_id:true})

const contentSchema = new mongoose.Schema<IContent>({
    media:[{type:mongoose.Schema.Types.ObjectId,ref:"Media"}],
    gif:[{type:mongoose.Schema.Types.ObjectId,ref:"Media"}],
    poll:pollSchema,
    tweet:{type:mongoose.Schema.Types.ObjectId,ref:"Tweet"},
},{_id:false})

const TweetSchema = new mongoose.Schema<ITweet>({
    author : {type:mongoose.Schema.Types.ObjectId,required:true},
    parent_tweet : {type:mongoose.Schema.Types.ObjectId},
    text : {type:String,maxlength:400,default:""},
    content : contentSchema,
    tagged_people : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    
    who_can_reply : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    who_can_see : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],

    time : {type: Date,required:true,default:Date.now()},
    num_views : {type: Number,default:0},
    num_likes : {type: Number,default:0},
    num_comments : {type: Number,default:0},
    num_retweet : {type: Number,default:0},
    num_quotes : {type: Number,default:0},
    liked_by : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    retweet_by : [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    quotes_tweets : [{type:mongoose.Schema.Types.ObjectId,ref:"Tweet"}],
    comment_tweets : [{type:mongoose.Schema.Types.ObjectId,ref:"Tweet"}],
    
})

const Tweet = mongoose.models.Tweet || mongoose.model<ITweet>("Tweet", TweetSchema);
export default Tweet