// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../models/Tweet'
import User, { IUser } from '../../../models/User'
import { serialize } from 'cookie'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getUserSession } from '@/lib/getUserFromToken'

type Data = IUser | { msg: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const {
        body,
        method
    } = req
    await dbConnect()
    
    // if (method === 'POST') {
    //     const { email, name, user_name, password } = body

    //     if (typeof email !== 'string' || typeof name !== 'string' || typeof user_name !== 'string' || typeof password !== 'string' ||
    //         email.length > 40 || email.length < 4 || name.length < 4 || name.length > 40 || user_name.length > 10 || user_name.length < 2 ||
    //         password.length < 5 || password.length > 20) {
    //         return res.status(400).json({ msg: 'Incorrect req body' })
    //     }
    //     try {
    //         const check_email = await User.find({ email })
    //         const check_username = await User.find({ user_name })
    //         if ((check_email && check_email[0]) || (check_username && check_username[0])) {
    //             return res.status(400).json({ msg: 'User already exist' })
    //         }

    //         const user_password = await bcrypt.hash(password, 10)
    //         const new_user = await User.create({
    //             email,
    //             name,
    //             user_name,
    //             accounts: {
    //                 password: { password: user_password }
    //             }
    //         })
    //         if (!new_user) return res.status(501).json({ msg: 'Some internal error occured' })

    //         const token = jwt.sign({ _id: new_user._id.toString(), email }, process.env.JWT_TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
    //         res.setHeader('Set-Cookie', serialize('auth-token', token, {
    //             httpOnly: false,
    //             maxAge: 60 * 60 * 100000,
    //             sameSite: 'strict',
    //             path:'/'
    //         }))
    //         return res.status(201).json(new_user)
    //     } catch (error){
    //         return res.status(500).json({msg : 'some internal error occured!'})
    //     }
    // }

    res.status(405).json({msg:'Incorrect method'})
}
