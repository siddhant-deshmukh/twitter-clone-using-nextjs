// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User, { IUser, IUserStored } from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

type Data = IUser | { msg: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    // console.log(req.cookies)
    const {
        body,
        method
    } = req
    await dbConnect()
    // const user = await getUserSession(req, res)
    // if(!user){
    //     return res.status(401).json({msg : 'error in token!!'})
    // }

    

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
                // doesFollow: { $in: [defaultUserId, "$followers"] },
                num_followers: { $size: "$followers" },
                num_following: { $size: "$following" },
            }
        }
    ])


    res.setHeader('Set-Cookie', serialize('meow', 'Bhittu Meow', {
        httpOnly: false,
        maxAge: 60 * 60 * 100000,
        sameSite: true,
        path:'/'
    }))
    // console.log("setting header")
    if (users.length > 0) {
        res.status(200).json(users[0])
    } else {
        res.status(404).json({ msg: 'User not found' })
    }
}
