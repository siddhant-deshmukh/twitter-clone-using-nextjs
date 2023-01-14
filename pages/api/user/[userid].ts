import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordLogInCredentials} from '../../../types'
import User, { IUser, IUserProfile } from "../../../models/User"
import connectDB from "../../../middlewares/mongodb"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
//comment later
import { getToken } from "next-auth/jwt"
import mongoose from 'mongoose'
import { GetUserSnippet } from './details'
import { getTweet } from '../tweet/[tweet_id]'
const secret = process.env.NEXTAUTH_SECRET



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
        const {userid ,get}:{userid?:string,get?:"like"|"media"|"tweets"|"followers"|"following"}   = req.query

        if(!userid) return res.status(422).json({msg:'Incorrect Params'});
        
        var {startingAt, inTotal}   = req.query
        var starting_at:number=-5,total:number=5;
        if(startingAt && inTotal){
          starting_at  = parseInt(startingAt as string)
          total = parseInt(inTotal as string)
        }

        const res_ = await getUserData(userid,get,starting_at,total)
        return res.status(res_.status).json(res_)
        
      }else{
        return res.status(422).json({msg:'req_method_not_supported'});
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({msg:"error",error});
    }
  };
  
async function getUserData(userid?:string,get?:"like"|"media"|"tweets"|"followers"|"following",starting_at?:number,total?:number){
    const user_id = new mongoose.Types.ObjectId(userid)

    const type_param = {
        like:"likes",
        tweets:"tweets",
        media:"media",
        followers:"followers",
        following:"following"
    }
    const field = type_param[get as "like"|"media"|"tweets"|"followers"|"following"]
    if(get && field && starting_at && total){
        const Item = await User.aggregate([
            {$match : {_id : user_id }},
            {
                $project : {
                    "length" : {$size : `$${field}`},
                    field : { $slice :[`$${field}`,starting_at,total] },
                }
            }
        ])
        if(Item && Item.length>0){
            if(Item[0].length < -1*starting_at && Item[0].length > total){
              Item[0].field = Item[0].field.slice(-1*starting_at-Item[0].length) 
            }
            var finalList = []
            console.log(Item[0])
            if(get==="followers" || get==="following"){
              finalList = await Promise.all(Item[0].field.map(async (user_Id:string,num:number)=>{
                if(user_Id){
                  let result_ = await GetUserSnippet(user_Id)
                  //console.log(num)
                  return result_
                }
                
              }))
            }else{
              finalList = await Promise.all(Item[0].field.map(async (tweet_id:string,num:number)=>{
                if(tweet_id){
                  let result_ = await getTweet(tweet_id)
                  //console.log(num)
                  return result_
                }
                
              }))
            }
            return {status:201, ...Item[0],by:finalList}
          }else{
            return {status:401, msg:"User not found"}
          }
    }else{
        const Item = await User.aggregate([
            {$match : {_id : user_id }},
            {
                $project : {
                    email:0,auth_complete:0,accounts:0,password:0,
                    followers:0,following:0,tweets:0,likes:0,own_tweets_comments:0
                }
            }
        ])
        if(Item && Item.length>0){
            return {status:201, ...Item[0]}
        }else{
            return {status:401, msg:"tweet not found"}
        }
    }
}

export default connectDB(handler);