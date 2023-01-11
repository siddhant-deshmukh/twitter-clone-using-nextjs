import type { NextApiRequest, NextApiResponse } from 'next'
import { s3Client } from "../../../lib/s3";
import { GetObjectAclCommand,ListObjectsCommand } from "@aws-sdk/client-s3";
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export const bucketParams = {
    Bucket : "twitter-clone-sd",
    // Key : "some_file"
}
export const ListObjectsInBucket = async () => {
  try {
    const bucketParams = {
      Bucket : "twitter-clone-sd",
      // Key : "some_file"
    }
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    // console.log("Success", data.Contents);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
// run();

const handler = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<any> => {
  if(req.method === 'GET'){

  }else if(req.method === 'POST'){
    const session = await unstable_getServerSession(req, res, authOptions)
    if(session && session.user._id){
      const {name , type} = req.body 
    }else{
      return res.status(401).json({ msg: 'authentication needed!' });
    }
  }
  // const data = await ListObjectsInBucket()
  // return res.status(201).json(data)
}

export default handler