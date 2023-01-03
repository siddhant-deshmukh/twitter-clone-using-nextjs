import type { NextApiRequest, NextApiResponse } from 'next'
import {UserEmailPasswordLogInCredentials} from '../../../types'
import User from "../../../models/User"
import connectDB from "../../../middlewares/mongodb"
import {API_SignUp_ResponseData} from "../../../types/index"

const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
    try{
      if (req.method === 'POST') {
        
      }else if(req.method === 'GET'){
        
      }else if(req.method === 'DELETE'){

      }else{
        
      }
    }catch(error){
      console.log(error)
      return res.status(500).json({msg:"error",error});
    }
  };
  
  export default connectDB(handler);