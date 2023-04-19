// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import Retweet from '@/models/Retweet'

type Data = { userId: string }[] | { msg: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const {
    body,
    method
  } = req
  await dbConnect()


  let { skip, limit, tweet_id } = req.query
  const user = await getUserSession(req, res)
  if (!user) {
    return res.status(401).json({ msg: 'error in token!!' })
  }
  
  // tweet_id = '64219d6ca6a5b870d5753c30'
  if (!tweet_id || tweet_id.length !== 24) {
    return res.status(404).json({ msg: 'No tweet_id found' })
  }
  const tweet = await Tweet.findById(tweet_id)
  if(!tweet) return res.status(404).json({ msg: 'Tweet not found' })

  const tweetid = new mongoose.Types.ObjectId(tweet_id as string)
  // console.log(tweetid)

  if (method === 'GET') {

    // const tweets = await Liked.find({tweetId : tweetid})
    const tweets = await Retweet.aggregate([
      { $skip: (skip) ? Number(skip) : 0 },
      { $match: { tweetId: tweetid } },
      { $limit: (limit) ? Number(limit) : 5 },
      {
        $project: { userId: 1, _id: 0 }
      }
    ])
    if (tweets) {
      return res.status(200).json(tweets)
    } else {
      return res.status(404).json({ msg: 'Tweet not found' })
    }
  } 
  // else if (method === 'POST') {

  //   const isRetweeted = await Retweet.find({tweetId:tweetid,userId:user._id})
  //   if(isRetweeted.length > 0){
  //     const retweeted = await Retweet.findByIdAndDelete(isRetweeted[0]._id)
  //     if(retweeted){
  //       tweet.num_retweet -= 1
  //       tweet.save()
  //     }
  //     return res.status(201).json({msg : "Deleted sucessfully!"})
  //   }else{  
  //     const retweeted = await Retweet.create({
  //       tweetId:tweetid,
  //       userId:user._id
  //     })
  //     if(retweeted){
  //       tweet.num_retweet += 1
  //       tweet.save()
  //     }
  //     return res.status(201).json({msg : "Created! sucessfully!"})
  //   }
  // } 
  else {
    return res.status(405).json({msg : "Method not allowed"})

  }
  // console.log('here to look tweet',tweet_id)
  // if (tweets.length > 0) {
  //   res.status(200).json(tweets[0])
  // } else {
  //   res.status(403).json({ msg: 'Tweet not found' })
  // }
}
