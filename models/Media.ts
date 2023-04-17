import mongoose from "mongoose";

export interface IMedia {
    type: "image/png" | "image/jpg" | "image/jpeg" | "image/webp" | "image/gif" | "video",
    url?: string,
    key?: string,
    size: number,
    uploaded: boolean,
    file? : File,
    parent_tweet:mongoose.Types.ObjectId,
    author:mongoose.Types.ObjectId
}

const mediaSchema = new mongoose.Schema<IMedia>({
    // parent_tweet:mongoose.Types.ObjectId,
    author: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    parent_tweet: { type: mongoose.Schema.Types.ObjectId, required: true, index: true  },
    type: { type: String, required: true, enum: ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"] },
    key: { type: String },
    url: { type: String, required: true },
    uploaded: { type: Boolean, default: false },
    size: { type: Number, required: true, max: 2097152}, // 2MB
})
const Media = mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);
export default Media