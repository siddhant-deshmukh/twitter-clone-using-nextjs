import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordLogInCredentials} from '../../../types'
import User from "../../../models/User"
import connectDB from "../../../middlewares/mongodb"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
//comment later
import { getToken } from "next-auth/jwt"
import Tweet, { ITweet, ITweetContent } from '../../../models/Tweet'
import mongoose from 'mongoose'
const secret = process.env.NEXTAUTH_SECRET


const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
    try{
      const session = await unstable_getServerSession(req, res, authOptions)
      if (req.method === 'POST') {
        const tweetContent : ITweetContent = req.body
        
        if(!tweetContent) return res.status(401).json({msg:'no tweet to upload'});
        if(tweetContent.tagged_people.length > 10) return res.status(401).json({msg:'should not tag more than 10 people'});
        if(tweetContent.text.length > 300) return res.status(401).json({msg:'text limit exceeding'});
        //if(tweetContent.tagged_people.length > 10) return res.status(401).json({msg:'should not tag more than 10 people'});
        
        if ((session && session.user.user_name && session.user._id)) {
          const tweet : ITweetContent = {
            ...tweetContent,
            author : session.user._id
          }
          //console.log(tweet)
          const uploadedTweet = await Tweet.create(tweet)
          //console.log(uploadedTweet)
          if(!uploadedTweet){
            return res.status(401).json({msg:'Error unable to create Tweet!'});
          }
          //@ts-ignore
          const updatedUser = await User.findByIdAndUpdate(session.user._id,{$push : {tweets:uploadedTweet._id}}).select({'user_name':1})
          if(tweetContent.parent_tweet ){
            console.log(tweetContent.parent_tweet)
            const updated_parent_tweet = await Tweet.findByIdAndUpdate(
              tweetContent.parent_tweet,{
                //@ts-ignore
                $push : {comment_tweets : uploadedTweet._id}, 
                $inc : {num_comments:1}
              }
            ).select({'author':1})
          }
          
          return res.status(201).json({tweet:uploadedTweet,updatedUser})
        } else {
          return res.status(401).json({msg:'authentication needed!'});
        }
      }else if(req.method === 'GET'){
        const { startingAt, inTotal } = req.query
        var starting_at:number=-5,total:number=5;
        if(startingAt && inTotal){
          starting_at  = parseInt(startingAt as string)
          total = parseInt(inTotal as string)
        }

        var tweets = [] 
        if ((session && session.user.user_name && session.user._id)){
          const tweets = await Tweet.aggregate([
            {$skip : starting_at},
            {$limit:total},
            { $project: { "_id": 1, "who_can_reply": 0, "who_can_see": 0,"comment_tweets": 0, "quotes_tweets": 0, "liked_by": 0,"retweet_by": 0}},

            {$addFields:{"has_liked" : {
                        $in : [new mongoose.Types.ObjectId(session.user._id), "$liked_by"]
                      }, "has_retweet":{
                        $in : [new mongoose.Types.ObjectId(session.user._id), "$retweet_by"]
                      }}},
          ])
        }else{
          tweets =await Tweet.aggregate([
            {$skip : starting_at},
            {$limit:total},
            { $project: { "_id": 1, "who_can_reply": 0, "who_can_see": 0,"comment_tweets": 0, "quotes_tweets": 0, "liked_by": 0,"retweet_by": 0}},
          ])
        }
        res.status(201).json(tweets)
      }else{
        res.status(422).json({msg:'req_method_not_supported'});
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({msg:"error",error});
    }
  };


export default connectDB(handler);