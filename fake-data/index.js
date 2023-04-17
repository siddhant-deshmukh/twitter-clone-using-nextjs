const { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
const mongoose = require('mongoose')
const { create_users, UploadUsers, addFollowersFollowings, create_tweets, ModifyUsers, UploadTweets, UpdateUsers, AddCommets, UploadComments } = require('./functions')
const { mongo_url, blob_url, blob_acess_key } = require('./secret')

const sharedKeyCredential = new StorageSharedKeyCredential( 'devstoreaccount1', blob_acess_key);
const blobServiceClient = new BlobServiceClient(blob_url, sharedKeyCredential);


mongoose.connect(mongo_url)
    .then(async () => {
        console.log("Connected to database")
        let users_array = create_users()
        // console.log(users_array)

        let res__ = await UploadUsers(users_array,blobServiceClient)
        let userids = res__.user_ids
        let users = res__.users
        users = addFollowersFollowings(userids, users)
        
        // console.log(users)
        // let tweets_array = []
        // ({ tweets_array, users } = create_tweets(userids,users)
        res__ = create_tweets(userids,users)
        let tweets_array = res__.tweets_array 
        users = res__.users

        // console.log()
        // console.log(tweets_array)
        res__ = await UploadTweets(tweets_array,blobServiceClient)
        let tweets = res__.tweets
        let tweet_ids = res__.tweet_ids

        // ({ comments : comment_array, tweets } = AddCommets(tweets,users))
        // console.log('tweets', tweets)
        res__ = AddCommets(tweets,users,tweet_ids)
        let comment_array = res__.comments 
        tweets = res__.tweets 
        // ({ comment_ids , tweets } = UploadComments(tweets))
        // console.log('\n\n\nbefore upload comments', Object.keys(tweets))
        res__ = await UploadComments(comment_array,tweets)
        let comment_ids = res__.comment_ids 
        tweets = res__.tweets

        // console.log('\n\n\nbefore modify users', Object.keys(tweets))
        users = await ModifyUsers(tweets, users)

        // console.log(users)
        await UpdateUsers(users)
        console.log('\n\nDone!')
    })
    .catch((err) => { console.error("Unable to connect database", err) })

// console.log("Connected to database")
// let users_array = create_users()
// // console.log(users_array)
// let users = {}
// users_array.forEach((user, index) => {
//     users[index] = user
// })
// let userids = Object.keys(users)
// console.log(userids)
// // console.log()
// // console.log(users)
// // console.log(new_users)
// let tweets_array = create_tweets(userids)
// console.log()
// // console.log(tweets_array)
// let tweets = {}
// tweets_array.forEach((tweet, index) => {
//     tweets[index] = tweet
// })
// let tweetids = Object.keys(tweets)
// console.log(tweets)
// console.log()
// users = ModifyUsers(tweetids, tweets, users)
// console.log(users)