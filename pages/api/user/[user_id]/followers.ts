// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User, { IUser } from '../../../../models/User'

type Data = IUser | { msg: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const defaultUser = "64219d64a6a5b870d5753c03"
    const defaultUserId = new mongoose.Types.ObjectId(defaultUser as string)

    const {
        body,
        method
    } = req
    await dbConnect()

    const { user_id } = req.query
    if (!user_id || user_id.length !== 24) {
        return res.status(404).json({ msg: 'No user_id found' })
    }
    const userid = new mongoose.Types.ObjectId(user_id as string)

    const users = await User.aggregate([
        { $match: { _id: userid } },
        {
            $project: {
                name: 1, user_name: 1, about: 1, avatar: 1,
                // following: 1, followers: 1,
                doesFollow: { $in: [defaultUserId, "$followers"] },
                num_followers: { $size : "$followers" },
                num_following: { $size : "$following" },
            }
        }
    ])


    if (users.length > 0) {
        res.status(200).json(users[0])
    } else {
        res.status(404).json({ msg: 'User not found' })
    }
}
