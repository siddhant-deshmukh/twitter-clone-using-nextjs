// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../models/Tweet'
import User, { IUser, IUserStored } from '../../../models/User'
import { serialize } from 'cookie'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getUserSession } from '@/lib/getUserFromToken'

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
    // const user = await getUserSession(req, res)
    // if(!user){
    //     return res.status(403).json({msg : 'error in token!!'})
    // }

    // if (method === 'POST') {
    //     const { password, user_name } = body
    //     // console.log(password,user_name)
    //     if (typeof user_name !== 'string' || typeof password !== 'string' ||
    //         user_name.length > 10 || user_name.length < 2 ||
    //         password.length < 5 || password.length > 20) {
    //         return res.status(400).json({ msg: 'Incorrect req body' })
    //     }
    //     try {
    //         const check_username: IUserStored[] = await User.find({ user_name })
    //         if (!(check_username && check_username[0])) {
    //             return res.status(404).json({ msg: 'User name doesn`t exist' })
    //         }
    //         //@ts-ignore
    //         let actual_password = check_username[0].accounts.get('password').password
    //         console.log(actual_password)
    //         if (actual_password) {
    //             if (!(await bcrypt.compare(password, actual_password)))
    //                 return res.status(406).json({ msg: 'Wrong password!' });

    //             const token = jwt.sign({ _id: check_username[0]._id.toString(), email: check_username[0].email }, process.env.JWT_TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
    //             res.setHeader('Set-Cookie', serialize('auth-token', token, {
    //                 httpOnly: true,
    //                 maxAge: 60 * 60 * 100000,
    //                 sameSite: 'strict',
    //                 path:'/'
    //             }))
    //             return res.status(201).json(token)
    //         } else {
    //             // console.log(check_username[0].accounts.password?.password,check_username)
    //             return res.status(400).json({ msg: 'Doesn`t allow password login' })
    //         }
    //     } catch (error) {
    //         return res.status(500).json({ msg: 'some internal error occured!' })
    //     }
    // }

    res.status(405).json({msg:'Incorrect method'})
}
