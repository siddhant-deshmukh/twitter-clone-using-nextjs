import mongoose from "mongoose";

export interface IMedia{
    type:"image/png" | "image/jpg" | "image/jpeg" | "image/webp"| "image/gif" | "video", 
    url?:string,
    key?:string,
    size:number,
    file:any,
    parent_tweet?:mongoose.Types.ObjectId
}
const mediaSchema = new mongoose.Schema<IMedia>({
    parent_tweet:mongoose.Types.ObjectId,
    type:{type:String,enum:["image/png" , "image/jpg" , "image/jpeg" , "image/webp","image/gif"]},
    key:String,
    url:String,
    size:Number,
})
const Media = mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);
export default Media