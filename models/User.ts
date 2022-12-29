import mongoose,{Types} from "mongoose";

export interface IUser{
    user_name?:string,
    email:string,
    name:string,
    dob?:Date,
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
    about?:string,
    followers?:[Types.ObjectId],
    following?:[Types.ObjectId],
    tweets?:[Types.ObjectId],
    likes?:[Types.ObjectId],
    own_tweets_comments?:[Types.ObjectId],
    joined?:Date,
    avatar?:String,
    profile_pic?:String
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {type:String,required:true,unique:true},
    name:{type:String,required:true,maxLength:40},
    auth_complete:{type:Boolean,required:true,default:false},
    accounts: {type:Map,required:true} ,

    user_name : {type:String,maxLength:10,sparse:false},
    dob:{type:Date,max:Date.now()},
    about:{type:String,maxLength:150},
    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'followers'}],
    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'following'}],
    tweets:[{type: mongoose.Schema.Types.ObjectId, ref: 'tweets'}],
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'tweets_liked'}],
    own_tweets_comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'own_tweets'}],
    joined:{type:Date,default: Date.now()},

    avatar:{type:String},
    profile_pic:{type:String},
})

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User