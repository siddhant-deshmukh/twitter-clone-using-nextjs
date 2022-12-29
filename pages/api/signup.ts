import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordSingUpCredentials} from '../../types'
import User from '../../models/User'
import bcrypt from "bcryptjs"
import connectDB from "../../middlewares/mongodb"
import {API_SignUp_ResponseData} from "../../types/index"

const handler  = async (req:NextApiRequest, res:NextApiResponse<API_SignUp_ResponseData>) : Promise<any> => {
    if (req.method === 'POST') {
      // Check if name, email or password is provided
      const credentials : UserEmailPasswordSingUpCredentials = req.body;
      const { name, email, password, user_name, dob} = credentials
      if (name && email && password && user_name && dob) {
          try {
            // Hash password to store it in DB
            var passwordhash = await bcrypt.hash(password,10);
            const check_user = await User.findOne({email})
            if(check_user){
                return res.status(409).json({msg:"Email already exist! Please login"})
            }
            var user = new User({
              name,
              email,
              password: passwordhash,
              user_name,
              dob
            });
            // Create new user
            const usercreated = await user.save();
            return res.status(200).json({ user:usercreated});
          } catch (error) {
            return res.status(500).json({msg:"error",error});
          }
        } else {
          res.status(422).json({msg:'data_incomplete'});
        }
    } else {
      res.status(422).json({msg:'req_method_not_supported'});
    }
  };
  
  export default connectDB(handler);