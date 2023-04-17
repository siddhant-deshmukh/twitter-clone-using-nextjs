const { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
const mongoose = require('mongoose')
const { mongo_url, blob_url, blob_acess_key, blob_account_name } = require('./secret')
const { create_tweets, GetUsers, ModifyUsers, CreateMedia, UploadTweets, UpdateUsers, AddCommets, UploadComments } = require('./functions')

const User = require('./User')
const Tweet = require('./Tweet')
const Liked = require('./Liked')
const Retweet = require('./Retweet')
const Media = require('./Media');
const { UpdateUsersSlowly } = require('./create-users');

const sharedKeyCredential = new StorageSharedKeyCredential(blob_account_name, blob_acess_key);
const blobServiceClient = new BlobServiceClient(blob_url, sharedKeyCredential);

mongoose.connect(mongo_url)
    .then(async () => {
        let users = await GetUsers()
        
        // await new Promise(r => setTimeout(r, 2000));
        
        let res__ = create_tweets(Object.keys(users), users, 5)
        let tweets_array = res__.tweets_array
        users = res__.users

        res__ = await UploadTweetsSlow(tweets_array, blobServiceClient)
        let tweet_ids = res__.tweet_ids
        let tweets = res__.tweets
        // tweets = addFollowersFollowings(tweet_ids, tweets)

        res__ = AddCommets(tweets, users, tweet_ids,0)
        let comment_array = res__.comments
        tweets = res__.tweets
        // ({ comment_ids , tweets } = UploadComments(tweets))
        // console.log('\n\n\nbefore upload comments', Object.keys(tweets))
        res__ = await UploadComments(comment_array, tweets)
        let comment_ids = res__.comment_ids
        tweets = res__.tweets

        users = await ModifyUsers(tweets, users)
        await UpdateUsersSlowly(users)

        console.log("\nDone!!\n")
    })

async function UploadTweetsSlow(tweets_array, blobServiceClient) {
    // console.log(tweets_array)
    const tweet_ids = []
    const tweets = {}
    for (let tweet of tweets_array) {
        const new_tweet = await Tweet.create(tweet)
        if (new_tweet && new_tweet._id) {
            let media = []
            let numMedia = Math.floor(Math.random() * 4)
            for (var i = 0; i < numMedia; i++) {
                let media_id = await CreateMedia(blobServiceClient, new_tweet._id, new_tweet.author, i)
                // console.log('Media no', i, media_id)
                media.push(media_id)
            }
            media = media.filter(ele => ele)
            // if (numMedia > 0) {
            //     await Tweet.findByIdAndUpdate(new_tweet._id, { media }).then(() => { console.log("UUUUpdated tweet") })
            //         .catch((err) => { console.log("Unable to update tweet", err) })
            // }

            new_tweet.media = media
            console.log('tweet_id', new_tweet._id, 'num media', numMedia, media)

            // console.log('tweet_id', new_tweet._id)

            tweet_ids.push(new_tweet._id.toString())
            tweets[new_tweet._id.toString()] = new_tweet
            // await new Promise(r => setTimeout(r, 2000));
        }

    }
    
    return { tweet_ids, tweets }
}
// async function UpdateTweetsSlowly(tweets) {
//     for (let tweet_id of Object.keys(tweets)) {
//         await Tweet.findByIdAndUpdate(tweet_id, tweets[tweet_id])
//     }
// }