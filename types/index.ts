import { IUser } from "../models/User"

export interface UserEmailPasswordSingUpCredentials {
  name : string ,
  email : string,
  password : string,
  user_name? : string ,
  dob : Date ,
}

export interface UserEmailPasswordLogInCredentials {
  email : string,
  password : string,
}

export interface  UserSessionProfileData  {
  id:string,
  email : string,
  name : string
}

export interface API_SignUp_ResponseData {
    msg?: string,
    user?: IUser,
    error?: unknown
}

export interface API_Authenticate_RequestData {
  email : string,
  password? : string,
  sub? : string,
  provider : "google" | "github" | "login_email_password" | "signup_email_password",
  user_name? : string ,
  name? : string ,
  dob? : Date ,
}

export interface API_Authenticate_ResponseData {
  email : string,
  user_name? : string,
  name : string,
  _id : string,
  auth_type: "google" | "github" | "login_email_password" | "signup_email_password",
}