import mongoose,{Types} from "mongoose";

export interface IUserCreate{
    user_name:string,
    name:string,
    email:string,
    
    avatar?:string,
    about?:string,

    accounts:{
        [key : string] : { sub? : string, password? : string}
    },
    dob?:Date,
}
export interface IUserStored extends IUserCreate{
    _id:Types.ObjectId,
    
    num_followers?:number,
    num_following?:number,

    num_tweets?:number,
    followers:[Types.ObjectId],
    following:[Types.ObjectId],
}
export interface IUserSnippet{

    _id:Types.ObjectId,
    user_name:string,
    name:string,
    avatar?:string,
    about?:string,
    followers:[string],
    following:[string],
}
export interface IUser  extends IUserSnippet {
    
    followers:[string],
    following:[string],

    num_followers?:number,
    num_following?:number,
    num_tweets?:number,

    doesFollow?:true | false
}

const UserSchema = new mongoose.Schema<IUserStored>({
    email: {type:String,required:true,unique:true,maxLength:40,minlength:4},
    name:{type:String,required:true,maxLength:40,minlength:4},
    accounts: {type:Map,required:true} ,

    user_name : {type:String,maxLength:10,sparse:false,required:true,unique:true,minlength:2},
    dob:{type:Date,max:Date.now()},
    about:{type:String,maxLength:150},

    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'followers'}],
    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'following'}],
    
    num_tweets:{type:Number,default:0},
    avatar:{type:String},
})

const User = mongoose.models.User || mongoose.model<IUserStored>("User", UserSchema);
export default User

/**
 
mongoose.Model<IUserStored, {}, {}, {}, mongoose.Document<unknown, {}, IUserStored> & Omit<IUserStored & Required<{
    _id: Types.ObjectId;
}>, never>, any>

 */