import mongoose, { Types } from "mongoose";

export interface ILiked {
    userId: Types.ObjectId,
    tweetId: Types.ObjectId,
    time: Date,
}
const LikedSchema = new mongoose.Schema<ILiked>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    time: { type: Date, default : Date.now() }
})
const Liked = mongoose.models.Like || mongoose.model<ILiked>("Like", LikedSchema);
export default Liked