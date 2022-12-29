import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from 'next'
import {API_SignUp_ResponseData} from "../types/index"


type Handler = (req:NextApiRequest, res:NextApiResponse<API_SignUp_ResponseData>) => Promise<any>
  
// console.log(process.env.MONGO_ATLAS_URL)
export default function connectDB(handler:Handler){
  
  return async (req:NextApiRequest, res:NextApiResponse) => {
    if (mongoose.connections[0].readyState) {
      // Use current db connection
      return handler(req, res);
    }
    // Use new db connection
    console.log(`${process.env.MONGO_ATLAS_URL}`)
    await mongoose.connect(`${process.env.MONGO_ATLAS_URL}`)
      .then(()=>{console.log("Sucessfully connected!!!")})
      .catch((error)=>{console.log("Error !!!!!!!!!!!!!!!,",error)})
    return handler(req, res);
  };
};
