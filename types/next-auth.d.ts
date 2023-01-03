import NextAuth, { DefaultSession , DefaultToken } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      name: string,
      email: string,
      _id : string,
      user_name? : string,
    } & DefaultSession["user"]
  }
  interface User {
    id? : string | number,
    name: string,
    email: string,
    _id? : string,
    user_name? : string,
  }
  interface JWT {
    /** OpenID ID Token */
    idToken?: string,
    _id: string,
    email:string,
    user_name? : string,
  }
}