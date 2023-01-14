import mongoose,{Types} from "mongoose";

export interface IUserSnippet{
    user_name:string,
    name:string,
    _id?:string,
    avatar?:string,
    about?:string,
}
export interface IUserProfile extends IUserSnippet{
    dob?:Date,
    num_followers?:number,
    num_following?:number,
    num_tweets?:number,
    joined?:Date,
    profile_pic?:String
}
export interface IUser extends IUserProfile{
    email:string,
    auth_complete:boolean,
    accounts:{
        google?:{
            sub?:string,
        },
        password?:{
            password:string,
        },
        github?:{
            sub?:string,
        }
    },
    password?:string,
    followers?:[Types.ObjectId],
    following?:[Types.ObjectId],
    tweets?:[Types.ObjectId],
    likes?:[Types.ObjectId],
    media?:[Types.ObjectId],
    own_tweets_comments?:[Types.ObjectId],
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {type:String,required:true,unique:true},
    name:{type:String,required:true,maxLength:40},
    auth_complete:{type:Boolean,required:true,default:false},
    accounts: {type:Map,required:true} ,

    user_name : {type:String,maxLength:10,sparse:false,required:true,unique:true},
    dob:{type:Date,max:Date.now()},
    about:{type:String,maxLength:150},
    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'followers'}],
    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'following'}],
    tweets:[{type: mongoose.Schema.Types.ObjectId, ref: 'tweets'}],
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'tweets_liked'}],
    own_tweets_comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'own_tweets'}],
    media:[{type: mongoose.Schema.Types.ObjectId, ref: 'own_tweets'}],
    joined:{type:Date,default: Date.now()},

    avatar:{type:String},
    profile_pic:{type:String},
})

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User