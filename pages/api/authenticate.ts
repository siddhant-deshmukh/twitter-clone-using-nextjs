import type { NextApiRequest, NextApiResponse } from 'next'
import {API_Authenticate_RequestData} from '../../types'
import User, { IUser } from "../../models/User"
import bcrypt from "bcrypt";
import connectDB from "../../middlewares/mongodb"
import {API_SignUp_ResponseData} from "../../types/index"

const createNewUser = async (credentials : API_Authenticate_RequestData) : Promise<any> => {
    const { name, email, password,user_name, sub, dob ,provider}  = credentials
    try {
      if (name && email && provider && (!(provider==="google"||provider==="github")||sub) && (!(provider==="signup_email_password")||password)) {
        var _user:IUser = {name, email, auth_complete:false,accounts:{}, dob}
        if(provider==="google" || provider==="github"){
          _user.accounts[provider] = {sub}
        }else if(provider==="signup_email_password"){
          //@ts-ignore
          var passwordhash : string = await bcrypt.hash(password,10);
          _user.accounts["password"] = {password:passwordhash}
          _user.password = passwordhash
          _user.user_name = user_name
        }else{
          return {msg:'Incorrect Provider',error:"data_incomplete"}
        }
        // console.log(_user)
        var user = await User.create(_user)
        return {user}
      }
      else {
        return {msg:'data_incomplete gotcha!',error:"data_incomplete"}
      }
    } catch (error) {
      console.log(error)
      return {msg:"error",error};
    }
}

const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
    try{
      if (req.method === 'POST') {
        // Check if name, email or password is provided
        const credentials : API_Authenticate_RequestData = req.body;
        const { email, password,provider,sub} = credentials
        const check_user = await User.findOne({email},["email","name","auth_complete","accounts","user_name"])
        
        if(provider === "google" || provider === "github"){
          if(check_user && check_user.accounts.get(provider)){
            return res.status(202).json({user:check_user})
          }else if(check_user){
            if(!sub) return res.status(409).json({msg:'data_incomplete gotcha!',error:"data_incomplete"});
            // console.log(check_user.accounts[provider])
            // check_user.accounts.set(provider,{sub})
            await check_user.save()
            return res.status(202).json({user:check_user})
          }else{
            // console.log("/n Here/n")
            const createNewUserResponse = await createNewUser(credentials);
            return res.status(200).json(createNewUserResponse);
          }
        }
        else if(provider === "login_email_password"){
          if(!password) return res.status(409).json({msg:'data_incomplete gotcha!',error:"data_incomplete"});
          if(check_user && check_user.accounts.get("password")){
            const is_password_correct : boolean = await bcrypt.compare(password, check_user.accounts.get("password").password)
            if(is_password_correct){
              return res.status(202).json({user:check_user})
            }else{
              return res.status(409).json({msg:"Incorrect Password"})
            }
          }else if(check_user){
            // console.log(check_user.accounts)
            return res.status(409).json({msg:"Can not use this method, Try login with "+provider})
          }else{
            return res.status(409).json({msg:"Email doesn't exist! Please SignUp"})
          }
        }
        else if(provider === "signup_email_password"){
          if(check_user){
            return res.status(409).json({msg:"Email already exist! Please login"})
          }else{
            const createNewUserResponse = await createNewUser(credentials);
            return res.status(200).json(createNewUserResponse);
          }
        }
      } else {
        res.status(422).json({msg:'req_method_not_supported'});
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({msg:"error",error});
    }
  };
  
  export default connectDB(handler);