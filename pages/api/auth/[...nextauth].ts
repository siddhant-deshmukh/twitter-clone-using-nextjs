import NextAuth, { NextAuthOptions } from "next-auth"
import type { NextApiRequest, NextApiResponse } from 'next'
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider  from "next-auth/providers/credentials";
import {API_Authenticate_RequestData, UserSessionProfileData} from "../../../types"
import User, { IUser } from "../../../models/User"
import bcrypt from "bcrypt";
import connectDB from "../../../middlewares/mongodb"

export const authOptions : NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
        clientId :process.env.GOOGLE_CLIENT_ID as string,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      id: "login_email_password",
      name: 'SignIn using Email and password',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials , req ) : Promise<UserSessionProfileData|null> {
        if(!credentials || !credentials.email || !credentials.password) return null;
        const user : UserSessionProfileData =  { id: "1",name:"d",email:credentials.email} //await res.json()
  
        // If no error and we have user data, return it
        if ( user) { //res.ok &&
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    }),
    CredentialsProvider({
      id: "signup_email_password",
      name: 'SignIn using Email and password',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
        password: {  label: "Password", type: "password" },
        name: { label: "Name", type: "text"}
      },
      async authorize(credentials , req ) : Promise<UserSessionProfileData|null> {

        if(!credentials || !credentials.email || !credentials.password || !credentials.name ) return null;
        const user : UserSessionProfileData =  { id: "1",name:credentials.name , email:credentials.email} 
  
        // If no error and we have user data, return it
        if ( user) { //res.ok &&
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks : {
    async signIn({ user, account, profile, email, credentials }){
      //console.log({ user, account, profile, email, credentials}, typeof  credentials )
      var reqBody : API_Authenticate_RequestData ;
      if(account?.provider==='google'){
        reqBody = {
          email:user.email as string,
          provider:"google",
          name:user.name as string,
          sub:user.id as string
        }
      }else if(account?.provider==='github'){
        reqBody = {
          email:user.email as string,
          provider:"google",
          name:user.name as string,
          sub:user.id as string
        }
      }else if(account?.provider==='login_email_password'){
        reqBody = {
          email:credentials?.email as string,
          provider:"login_email_password",
          password:credentials?.password as string,
        }
      }else if(account?.provider==='signup_email_password' && credentials){
        reqBody = {
          email:credentials?.email as string,
          provider:"signup_email_password",
          password:credentials?.password as string,
          name:credentials?.name as string,
          dob:credentials?.dob as Date,
          user_name:credentials?.dob as string
        }
      }else{

      }
      //${process.env.NEXTAUTH_URL}
      //console.log("\n/n reqBody :", reqBody)
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authenticate`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        //@ts-ignore
        body:JSON.stringify(reqBody)
      }).then((res)=> res.json())
      //const res = await authenticator()
      //console.log("response",res)
      
      const isAllowedToSignIn = true
      if (res.user && res.user._id) {
        user.name = res.user.name
        user._id = res.user._id
        user.user_name = res.user.user_name
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        //console.log("jwt user :" , token,account,profile)
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/details?email=${token.email}`).then(res=>res.json())
        console.log("response session ||", res)

        token.accessToken = account.access_token
        token._id = res.user._id
        token.user_name = res.user.user_name
        //console.log("final token ",token)
      }
      return token
    },
    async session({ session, token, user }) {
      //console.log("session", session, token, user )
      
      session.user._id = token._id as string
      session.user.user_name = token.user_name as string
      return session
    }
  }
}

// const createNewUser = async (credentials : API_Authenticate_RequestData) : Promise<any> => {
//   const { name, email, password,user_name, sub, dob ,provider}  = credentials
//   try {
//     if (name && email && provider && (!(provider==="google"||provider==="github")||sub) && (!(provider==="signup_email_password")||password)) {
//       var _user:IUser = {name, email, auth_complete:false,accounts:{}, dob}
//       if(provider==="google" || provider==="github"){
//         _user.accounts[provider] = {sub}
//       }else if(provider==="signup_email_password"){
//         //@ts-ignore
//         var passwordhash : string = await bcrypt.hash(password,10);
//         _user.accounts["password"] = {password:passwordhash}
//         _user.password = passwordhash
//         _user.user_name = user_name
//       }else{
//         return {msg:'Incorrect Provider',error:"data_incomplete"}
//       }
//       // console.log(_user)
//       var user = await User.create(_user)
//       return {user}
//     }
//     else {
//       return {msg:'data_incomplete gotcha!',error:"data_incomplete"}
//     }
//   } catch (error) {
//     console.log(error)
//     return {msg:"error",error};
//   }
// }

// const handler  = async (req:NextApiRequest, res:NextApiResponse<any>) : Promise<any> => {
//   try{
//     if (req.method === 'POST') {
//       // Check if name, email or password is provided
//       const credentials : API_Authenticate_RequestData = req.body;
//       const { email, password,provider,sub} = credentials
//       const check_user = await User.findOne({email},["email","name","auth_complete","accounts","user_name"])
      
//       if(provider === "google" || provider === "github"){
//         if(check_user && check_user.accounts.get(provider)){
//           return res.status(202).json({user:check_user})
//         }else if(check_user){
//           if(!sub) return res.status(409).json({msg:'data_incomplete gotcha!',error:"data_incomplete"});
//           // console.log(check_user.accounts[provider])
//           // check_user.accounts.set(provider,{sub})
//           await check_user.save()
//           return res.status(202).json({user:check_user})
//         }else{
//           // console.log("/n Here/n")
//           const createNewUserResponse = await createNewUser(credentials);
//           return res.status(200).json(createNewUserResponse);
//         }
//       }
//       else if(provider === "login_email_password"){
//         if(!password) return res.status(409).json({msg:'data_incomplete gotcha!',error:"data_incomplete"});
//         if(check_user && check_user.accounts.get("password")){
//           const is_password_correct : boolean = await bcrypt.compare(password, check_user.accounts.get("password").password)
//           if(is_password_correct){
//             return res.status(202).json({user:check_user})
//           }else{
//             return res.status(409).json({msg:"Incorrect Password"})
//           }
//         }else if(check_user){
//           // console.log(check_user.accounts)
//           return res.status(409).json({msg:"Can not use this method, Try login with "+provider})
//         }else{
//           return res.status(409).json({msg:"Email doesn't exist! Please SignUp"})
//         }
//       }
//       else if(provider === "signup_email_password"){
//         if(check_user){
//           return res.status(409).json({msg:"Email already exist! Please login"})
//         }else{
//           const createNewUserResponse = await createNewUser(credentials);
//           return res.status(200).json(createNewUserResponse);
//         }
//       }
//     } else {
//       res.status(422).json({msg:'req_method_not_supported'});
//     }
//   }catch(error){
//     console.log(error)
//     return res.status(500).json({msg:"error",error});
//   }
// };

// const authenticator= connectDB(handler);

export default NextAuth(authOptions)