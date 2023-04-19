// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../models/Tweet'
import User, { IUser, IUserStored } from '../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

type Data = ITweet[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const {
    body,
    method
  } = req
  await dbConnect()

  const user = await getUserSession(req, res)
  if (!user) {
    // return res.status(401).json({ msg: 'error in token!!' })
    // console.log("Getting temp")
    
      return res.status(401).json({msg:'Unautherized!'})
    
  }

  return res.status(200).json(user)
}
