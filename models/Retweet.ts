import mongoose, { Types } from "mongoose";

export interface IRetweet {
    userId: Types.ObjectId,
    tweetId: Types.ObjectId,
    time: Date,
}
const retweetSchema = new mongoose.Schema<IRetweet>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    time: { type: Date, default : Date.now() }
})
const Retweet = mongoose.models.Retweet || mongoose.model<IRetweet>("Retweet", retweetSchema);
export default Retweet