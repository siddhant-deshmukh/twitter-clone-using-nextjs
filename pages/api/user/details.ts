import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordLogInCredentials} from '../../../types'
import User, { IUser } from "../../../models/User"
import connectDB from "../../../middlewares/mongodb"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
//comment later
import { getToken } from "next-auth/jwt"
const secret = process.env.NEXTAUTH_SECRET

export const GetUserSnippet = async (_id?:string,email?:string,username?:string) : Promise<{_id:string,name:string,username:string,avatar?:string,about?:string} | null>  =>{
  var check_user;
  const parameters : string[] = ["_id","user_name","avatar","about","name"]
  if(_id){
    check_user = await User.findById(_id,parameters) 
  }else if(email){
    check_user = await User.findOne({email},parameters) 
  }else if(username){
    check_user = await User.findOne({username},parameters) 
  }else{
    return null
  }
  return check_user
}

const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
    try{
      if (req.method === 'PUT') {
        const session = await unstable_getServerSession(req, res, authOptions)
        const {name,dob,about,avatar}  = req.body 
        // if (session) {
        //   const check_user = await User.findById(session._id)
        //   if(check_user) return res.status(422).json({msg:'user name already exist'});

        //   const new_username = await User.findOneAndUpdate({_id:session.user._id},{user_name})
        //   return res.status(201).json({
        //     new_username
        //   });
        // } else {
        //   return res.status(401).json({msg:'please signin first'});
        // }
      }else if(req.method === 'GET'){
        const {username ,_id,email}  = req.query
        var check_user = await GetUserSnippet(_id as string|undefined ,email as string|undefined,username as string|undefined);        
        //console.log("Here as well")
        //console.log(check_user)
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