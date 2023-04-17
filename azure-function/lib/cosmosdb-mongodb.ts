import mongoose,{ Schema, model, connect } from "mongoose";

let db=null;

const UserSchema = new Schema({
    email: {type:String,required:true,unique:true,maxLength:40,minlength:4},
    name:{type:String,required:true,maxLength:40,minlength:4},
    accounts: {type:Map,required:true} ,

    user_name : {type:String,maxLength:10,sparse:false,required:true,unique:true,minlength:2},
    dob:{type:Date,max:Date.now()},
    about:{type:String,maxLength:150},

    followers:[{type: Schema.Types.ObjectId, ref: 'followers'}],
    following:[{type: Schema.Types.ObjectId, ref: 'following'}],
    
    num_tweets:{type:Number,default:0},
    avatar:{type:String},
})
const UserModel = mongoose.model("User", UserSchema); //mongoose.models.User || 

const mediaSchema = new mongoose.Schema({
    // parent_tweet:mongoose.Types.ObjectId,
    author: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    parent_tweet: { type: mongoose.Schema.Types.ObjectId, required: true, index: true  },
    type: { type: String, required: true, enum: ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"] },
    key: { type: String },
    url: { type: String, required: true },
    uploaded: { type: Boolean, default: false },
    size: { type: Number, required: true, max: 2097152}, // 2MB
})
const MediaModel =  mongoose.model("Media", mediaSchema); //mongoose.models.Media ||

export const findUserById = async (id : string) => {
    const check_user = await UserModel.findById(id).select({ accounts: 0, email: 0 });
    return check_user
}
export const findMediaById = async (id : string) => {
    const check_media = await MediaModel.findById(id)
    return check_media
}
export const markMediaUploaded = async (id : string) => {
    await MediaModel.findByIdAndUpdate(id,{
        uploaded : true,
    })
}
const CategorySchema = new Schema(
  { categoryName: String },
  { timestamps: true }
);
const CategoryModel = model("Category", CategorySchema, "Bookstore");

export const init = async () => {
    if(!db) {
    // console.log('Meow',process.env["MONGODB_CONNECTION_STRING"])
    db = await mongoose.connect(process.env["MONGODB_CONNECTION_STRING"]);
    // console.log('Bhau')
  }
};

export const addItem = async (doc) => {
  const modelToInsert = new CategoryModel();
  modelToInsert["categoryName"] = doc.name;

  return await modelToInsert.save();
};
export const findItemById = async (id) => {
  return await CategoryModel.findById(id);
};
export const findItems = async (query = {}) => {
  return await CategoryModel.find({});
};
export const deleteItemById = async (id) => {
  return await CategoryModel.findByIdAndDelete(id);
};

