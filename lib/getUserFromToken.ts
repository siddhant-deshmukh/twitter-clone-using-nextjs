import { NextApiResponse } from 'next'
import type { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'
import User, { IUserSnippet, IUserStored } from '@/models/User'
// import { cookies } from 'next/headers';
import { serialize } from 'cookie'


export async function getUserSession(req: NextApiRequest, res: NextApiResponse) : Promise<null | IUserSnippet> {
    try {
        // console.log()
        // console.log('cookies', req.cookies)
        // console.log()
        const token = req.cookies['auth-token']

        // console.log("Here is the cookies",req.cookies,token)
        if (!token) {
            throw 'No token'
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY || 'zhingalala');
        
        if (typeof decoded === 'string' || !decoded._id) {
            throw 'white decoding invalid token'
        }
        const user : IUserSnippet = await User.findById(decoded._id).select({ accounts: 0, email: 0 });
        
        if (!user) {
            throw 'user not found'
        }
        return user
    } catch (error) {
        console.log(error)
        res.setHeader('Set-Cookie', serialize('auth-token', '', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'strict',
            path:'/'
        }))
        return null;
    }
}

