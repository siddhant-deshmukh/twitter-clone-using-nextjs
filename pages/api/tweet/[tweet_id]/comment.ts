// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import { AddExtrasOnTweets } from '..'

type Data = ITweet[] | { msg: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const {
    body,
    method
  } = req

  try {
    await dbConnect()


    const user = await getUserSession(req, res)
    if (!user) {
      return res.status(401).json({ msg: 'error in token!!' })
    }
    const { tweet_id: parent_tweet, skip, limit } = req.query
    // console.log(skip,limit)
    // console.log(`${(skip)?Number(skip):0}`,`${(limit)?Number(skip):5}`)

    if (!parent_tweet || parent_tweet.length !== 24) {
      return res.status(400).json({ msg: 'No tweet_id found' })
    }
    const parent_tweet_id = new mongoose.Types.ObjectId(parent_tweet as string)
    // console.log(tweet_id)
    let comments = await Tweet.aggregate([
      { $match: { parent_tweet: parent_tweet_id } },
      { $sort: { time: -1 } },
      { $skip: (skip) ? Number(skip) : 0 },
      { $limit: (limit) ? Number(limit) : 5 },
      {
        $set: {
          authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
          have_liked: { $cond: [{ $gte: [{ $size: '$have_liked' }, 1] }, true, false] },
          have_retweeted: { $cond: [{ $gte: [{ $size: '$have_retweeted' }, 1] }, true, false] },
          // have_liked : { $arrayElemAt: ["$have_liked", 0] },
          // have_retweeted : { $arrayElemAt: ["$have_retweeted", 0] },
        }
      },
    ])
    // console.log('here to look tweet',tweet_id)
    comments = await AddExtrasOnTweets(comments,user._id)
    if (comments.length > 0) {
      res.status(200).json(comments)
    } else {
      res.status(404).json({ msg: 'Tweet not found' })
    }
  } catch (err) {
    res.status(500).json({ msg : 'Some internal error occured!' })
  }
}
