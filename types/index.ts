import { Types } from "mongoose"
import React from "react"
import { ITweetFileAttachments } from "../models/Tweet"
import { IUser } from "../models/User"

export interface IModalData {
  title : string,
  url : string,
  component?: (arg0:any) => JSX.Element,
  type : "tweet"|"login"|"signup"|"add_username"| "add_birthdate" | "liked_by" | "retweeted_by" | "edit_profile" |"",
  parameters? : any
}
export interface ITwitterContext{
  modalOn:boolean,
  setModalOn : React.Dispatch<React.SetStateAction<boolean>>,
  modalData:IModalData,
  setModalData:React.Dispatch<React.SetStateAction<IModalData>>,
  openModal: ({ title, url, component,parameters }: IModalData) => void,
  closeModal: ({goBack} : {goBack? : boolean} ) => void
} 
export interface UserEmailPasswordSingUpCredentials {
  name : string ,
  email : string,
  password : string,
  user_name? : string ,
  dob : Date ,
}

export interface ITweetEditorProps{
  motive : "home"|"modal", //"tweet" | "reply" | "quote",
  otherTweet? : Types.ObjectId,
  // tweetText : string,
  // setTweetText :  React.Dispatch<React.SetStateAction<string>>,
  // tweetAttachments:ITweetFileAttachments,
  // setTweetAttachments:React.Dispatch<React.SetStateAction<ITweetFileAttachments>>, 
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