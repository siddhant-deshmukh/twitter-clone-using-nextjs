import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordLogInCredentials} from '../../types'
import User from "../../models/User"
import connectDB from "../../middlewares/mongodb"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
//comment later
import { getToken } from "next-auth/jwt"
const secret = process.env.NEXTAUTH_SECRET


const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
    try{
      if (req.method === 'POST') {
        const session = await unstable_getServerSession(req, res, authOptions)
        const {user_name} : {user_name :String} = req.body 
        if(!user_name) return res.status(422).json({msg:'user name not found'});
        if ((session)) {
          const check_user = await User.findOne({user_name})
          if(check_user) return res.status(422).json({msg:'user name already exist'});

          const new_user = await User.findOneAndUpdate({_id:session.user._id},{user_name})
          return res.status(201).json({
            new_user
          })
        } else {
          return res.status(401).json({msg:'no user name,complete the autherization'});
        }
      }{
        return res.status(422).json({msg:'req_method_not_supported'});
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({msg:"error",error});
    }
  };
  
  export default connectDB(handler);