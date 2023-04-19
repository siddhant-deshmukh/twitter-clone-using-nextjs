// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import { AddExtrasOnTweets } from '..'

type Data = ITweet | { msg: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const {
    body,
    method
  } = req
  await dbConnect()


  const user = await getUserSession(req, res)
  if (!user) {
    return res.status(401).json({ msg: 'error in token!!' })
  }
  const { tweet_id } = req.query
  // console.log(skip,limit)
  // console.log(`${(skip)?Number(skip):0}`,`${(limit)?Number(skip):5}`)

  if (!tweet_id || tweet_id.length !== 24) {
    return res.status(404).json({ msg: 'No tweet_id found' })
  }
  const tweetid = new mongoose.Types.ObjectId(tweet_id as string)
  // console.log(tweet_id)
  let tweets = await Tweet.aggregate([
    { $match: { _id: tweetid } },  
  ])
  // console.log('here to look tweet',tweet_id)
  tweets = await AddExtrasOnTweets(tweets, user._id)
  if (tweets.length > 0) {
    res.status(200).json(tweets[0])
  } else {
    res.status(404).json({ msg: 'Tweet not found' })
  }
}