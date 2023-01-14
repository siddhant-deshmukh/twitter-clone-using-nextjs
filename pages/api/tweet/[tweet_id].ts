import type { NextApiRequest, NextApiResponse } from 'next'
import { UserEmailPasswordLogInCredentials } from '../../../types'
import User from "../../../models/User"
import connectDB from "../../../middlewares/mongodb"
import { API_SignUp_ResponseData } from "../../../types/index"
import Tweet, { ITweet } from '../../../models/Tweet'
import mongoose from 'mongoose'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { GetUserSnippet } from '../user/details'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<any> => {
  try {
    if (req.method === 'PUT') {
        const { tweet_id }: { tweet_id?: string } = req.query
        const { task_type }: { task_type?: "liked" | "retweet" | "tweet" } =  JSON.parse(req.body)
        //console.log(req.body)
        if (!tweet_id) return res.status(401).json({ msg: 'no required parameter' });

        const session = await unstable_getServerSession(req, res, authOptions)
        
        if ((session && session.user.user_name && session.user._id)) {
          //const _id = new mongoose.Types.ObjectId(tweet_id)
          const userObjectId = new mongoose.Types.ObjectId(session.user._id)
          var response_ ;
          if(task_type==="liked"){
            response_ = await handleLikingTweet(tweet_id,userObjectId)
          }else if(task_type==="retweet"){
            response_ = await handleRetweetingTweet(tweet_id,userObjectId)
          }
          
          if(response_){
            return res.status(response_.status).json({ msg : response_.msg ,task_type})
          }else{
            return res.status(201).json({ msg : "_" ,task_type})
          }
        } else {
          return res.status(401).json({ msg: 'authentication needed!' });
        }
    } else if (req.method === 'GET') {
        const { tweet_id,  get }: { tweet_id?: string, get?: "like" | "retweet" | "tweet" | "comments" | "quote_tweets" | undefined } = req.query
        var {startingAt, inTotal}   = req.query
        var starting_at:number=-5,total:number=5;
        if(startingAt && inTotal){
          starting_at  = parseInt(startingAt as string)
          total = parseInt(inTotal as string)
        }
        // console.log(typeof starting_at,typeof total)
        if (!tweet_id) return res.status(401).json({ msg: 'incorrect parameter' });
        const session = await unstable_getServerSession(req, res, authOptions)

        if (!get || get==="tweet") {
          const tweetList = await getTweet(tweet_id,session?.user?._id)
          if (!tweetList || tweetList.length === 0) return res.status(401).json({ msg: 'invalid tweet_id' });
          return res.status(201).json({ tweet: tweetList[0] });
        }else if( (get ==="like" || get ==="comments" || get==="quote_tweets" || get==="retweet") && starting_at && total){
          const response_ = await getTweetRelatedItems(tweet_id,starting_at as number,total,get)
          return res.status(response_.status).json(response_)
        }else{
          return res.status(401).json({ msg : "Incorrect Parameters" });
        }
        
    } else if (req.method === 'DELETE') {

    } else {

    }
    return res.status(201).json({ msg : "Something is wrong !!!" });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "error", error });
  }
};

async function handleLikingTweet(tweet_id : string,userObjectId : mongoose.Types.ObjectId) : Promise<{status:number,msg:string}>{
  
  const original_tweet =  await Tweet.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(tweet_id) } },
    {$project:{"has_liked" : {
                $in : [userObjectId, "$liked_by"]
              }}},
  ])
  // console.log(original_tweet[0])
  if(!original_tweet || !original_tweet[0]){
    return {status : 401,msg:"tweet doesn't exist"}
  }
  const tweetObjectId = original_tweet[0]?._id
  // if tweet has been already liked by user
  if(!original_tweet[0].has_liked){
    const updated_tweet = await Tweet.findByIdAndUpdate(tweetObjectId,{
      $inc : {num_likes : 1},
      $push : {liked_by : userObjectId}
    })
    const updated_user = await User.findByIdAndUpdate(userObjectId,{
      $push : {likes : tweetObjectId}
    })
    //console.log(updated_user)
    return {status : 201,msg:"sucessful"}

  }else{
    const updated_tweet = await Tweet.findByIdAndUpdate(tweetObjectId,{
      $inc : {num_likes : -1},
      $pull : {liked_by : {$eq : userObjectId}}
    })
    const updated_user = await User.findByIdAndUpdate(userObjectId,{
      $pull : {likes : {$eq :  tweetObjectId}}
    })
    return {status : 201,msg:"already liked"}
  }
}
async function handleRetweetingTweet(tweet_id : string,userObjectId : mongoose.Types.ObjectId) : Promise<{status:number,msg:string}>{
  const original_tweet =  await Tweet.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(tweet_id) } },
    {$project:{"has_retweet":{
                $in : [userObjectId, "$retweet_by"]
              }}},
  ])
  if(!original_tweet || !original_tweet[0]){
    return {status : 401,msg:"tweet doesn't exist"}
  }
  const tweetObjectId = new mongoose.Types.ObjectId(original_tweet[0]?._id)
  // const userObjectId = new mongoose.Types.ObjectId(session.user._id)
  if(!original_tweet[0].has_retweet){
    const updated_tweet = await Tweet.findByIdAndUpdate(tweetObjectId,{
      $inc : {num_retweet : 1},
      $push : {retweet_by : userObjectId}
    })
    const updated_user = await User.findByIdAndUpdate(userObjectId,{
      $push : {tweets : tweetObjectId}
    })
    return {status : 201,msg:"sucessful"}
  }else{
    const updated_tweet = await Tweet.findByIdAndUpdate(tweetObjectId,{
      $inc : {num_retweet : -1},
      $pull : {retweet_by : {$eq : userObjectId}}
    })
    const updated_user = await User.findByIdAndUpdate(userObjectId,{
      $pull : {tweets : {$eq :  tweetObjectId}}
    })
    return {status : 201,msg:"already retweedted!"}
  }
}
export async function getTweetRelatedItems(tweet_id:string,starting_at: number, total: number,get: "like" |  "retweet" | "comments" | "quote_tweets") {
  if(!(starting_at<0)) starting_at=-1;
  if(!(total<20 && total>0)) total=10;

  var field = "liked_by"
  if(get === "like") field = "liked_by"
  else if(get === "comments") field = "comment_tweets"
  else if(get === "quote_tweets") field = "quotes_tweets"
  else if(get === "retweet") field = "retweet_by"
  else{
    return {status:401, msg:"incorrect parameters"}
  }
  const Item = await Tweet.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(tweet_id) } },
    { $project: {
        "length" : {$size : `$${field}`},
        field : { $slice :[`$${field}`,starting_at,total] },
    } }
  ])
  
  //console.log(Item)
  if(Item && Item.length>0){
    if(Item[0].length < -1*starting_at && Item[0].length > total){
      Item[0].field = Item[0].field.slice(-1*starting_at-Item[0].length) 
    }
    const finalList = await Promise.all(Item[0].field.map(async (user_id:string,num:number)=>{
      if(user_id){
        let result_ = await GetUserSnippet(user_id)
        //console.log(num)
        return result_
      }
      
    }))
    return {status:201, ...Item[0],by:finalList}
  }else{
    return {status:401, msg:"tweet not found"}
  }
}
export async function  getTweet(tweet_id:string,_id?:string){
  if(!_id){
    const tweetList : ITweet[] = await Tweet.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(tweet_id) } },
      { $project: { "_id": 1, "who_can_reply": 0, "who_can_see": 0,"comment_tweets": 0, "quotes_tweets": 0, "liked_by": 0,"retweet_by": 0}},
    ])
    const finalList = await Promise.all(tweetList.map(async (tweet,num)=>{
      if(tweet && tweet.author){
        let result_ = await GetUserSnippet(tweet.author)
        return { ...tweet, authorDetails : result_}
      }
    }))
    // await Async.map(tweetList,
    //   async (tweet : ITweet)=>{
    //     if(tweet && tweet.author){
    //       let result_ = await GetUserSnippet(tweet.author)
    //       return { ...tweet, authorDetails : result_}
    //     }
    //   },
    // ).then((err,results)=>{
    //   if(err) console.log(err);
    //   if(results){
    //     finalList.push(results)
    //     //console.log("results :",results,finalList)
    //     //return results
    //   }
    // });
    //console.log("finalList", finalList)
    return finalList
  }else{
    const tweetList = await Tweet.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(tweet_id) } },
      {$addFields:{"has_liked" : {
                  $in : [new mongoose.Types.ObjectId(_id), "$liked_by"]
                }, "has_retweet":{
                  $in : [new mongoose.Types.ObjectId(_id), "$retweet_by"]
                }}},
      { $project: { "who_can_reply": 0, "who_can_see": 0,
                    "comment_tweets": 0, "quotes_tweets": 0, "liked_by": 0,"retweet_by": 0,
                  }
      },
    ])
    const finalList = await Promise.all(tweetList.map(async (tweet,num)=>{
      if(tweet && tweet.author){
        let result_ = await GetUserSnippet(tweet.author)
        return { ...tweet, authorDetails : result_}
      }
    }))
    return finalList
  }
}

export default connectDB(handler);