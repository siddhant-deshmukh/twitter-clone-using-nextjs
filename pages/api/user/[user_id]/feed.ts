// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User, { IUser } from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import Liked, { ILiked } from '@/models/Liked'
import { AddExtrasOnTweets } from '../../tweet'

type Data = IUser | { msg: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const {
        body,
        method
    } = req
    await dbConnect()

    // console.log(req.cookies)

    const { user_id, skip, limit, type }: {
        user_id?: string, skip?: string, limit?: string, type?: 'liked' | 'tweets'
    } = req.query

    if (!user_id || user_id.length !== 24) {
        return res.status(400).json({ msg: 'No user_id found' })
    }
    const userid = new mongoose.Types.ObjectId(user_id as string)

    const user = await getUserSession(req, res)
    if (!user) {
        return res.status(401).json({ msg: 'error in token!!' })
    }

    var tweets: any[] = [];
    if (type === 'liked') {
        let liked_by_user : ILiked[] = await Liked.aggregate([
            // getting the liked tweets!
            {$match : {userId : userid}},
            // { $sort : { time : -1 } },
            { $skip: (skip) ? Number(skip) : 0 },
            { $limit: (limit) ? Number(limit) : 5 },
        ])
        tweets = await Promise.all(liked_by_user.map(async (liked)=>{
            const tweet = await Tweet.findById(liked.tweetId)
            return tweet._doc
        }))
        // console.log(tweets)
    } else {
        tweets = await Tweet.aggregate([
            { $match: { author: userid } },
            { $sort : { time : -1 } },
            { $skip: (skip) ? Number(skip) : 0 },
            { $limit: (limit) ? Number(limit) : 5 },
        ])
    }

    tweets = await AddExtrasOnTweets(tweets, user._id)
    if (tweets) {
        res.status(200).json(tweets)
    } else {
        res.status(404).json({ msg: 'User not found' })
    }
}


// {
//     $lookup:
//     {
//         from: "tweets",
//         localField: "tweetId",
//         foreignField: "_id",
//         as: "tweet"
//     }
// },
// {
//     $project: {
//         tweet : { $arrayElemAt: [ "$tweet", 0 ] }, _id : 0
//     }
// },
// {
//     $replaceRoot : { newRoot : '$tweet' }
// },