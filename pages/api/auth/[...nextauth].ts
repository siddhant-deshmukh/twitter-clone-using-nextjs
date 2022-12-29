import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider  from "next-auth/providers/credentials";
import {API_Authenticate_RequestData, UserSessionProfileData} from "../../../types"


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
        name: { label: "Name", type: "text"},
        user_name: { label: "User Name", type: "text"},
        dob: { label: "Date of birth", type: "Date"},
      },
      async authorize(credentials , req ) : Promise<UserSessionProfileData|null> {

        if(!credentials || !credentials.email || !credentials.password || !credentials.name || !credentials.user_name || !credentials.dob) return null;
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
      // console.log("response",res)
      
      const isAllowedToSignIn = true
      if (res.user && res.user._id) {
        user.name = res.user.name
        user.id = res.user._id
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
        token.accessToken = account.access_token
        token._id = token.sub
        // console.log("final token ",token)
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      //session.accessToken = token.accessToken
      session.user._id = token._id as string
      // console.log("final session ",session)
      return session
    }
  }
}
export default NextAuth(authOptions)