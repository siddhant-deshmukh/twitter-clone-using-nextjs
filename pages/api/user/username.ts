import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordLogInCredentials} from '../../../types'
import User from "../../../models/User"
import connectDB from "../../../middlewares/mongodb"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
//comment later
import { getToken } from "next-auth/jwt"
const secret = process.env.NEXTAUTH_SECRET


const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
    try{
      if (req.method === 'PUT') {
        const session = await unstable_getServerSession(req, res, authOptions)
        const {user_name} : {user_name :String} = req.body 
        if(!user_name) return res.status(422).json({msg:'user name not found'});
        if ((session)) {
          const check_user = await User.findOne({user_name})
          if(check_user) return res.status(422).json({msg:'user name already exist'});

          const new_username = await User.findOneAndUpdate({_id:session.user._id},{user_name})
          return res.status(201).json({
            new_username
          });
        } else {
          return res.status(401).json({msg:'please signin first'});
        }
      }else if(req.method === 'GET'){
        const user_name = req.query.username as string
        if(!user_name) return res.status(422).json({msg:'user name not found'});
        const check_user = await User.findOne({user_name},["user_name"]) 
        console.log(check_user)
        if(check_user){
          return res.status(201).json({user:check_user})
        }else{
          return res.status(201).json({msg:"User not found!"})
        }
      }else{
        return res.status(422).json({msg:'req_method_not_supported'});
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({msg:"error",error});
    }
  };
  
  export default connectDB(handler);