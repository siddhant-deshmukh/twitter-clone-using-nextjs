// import { IUserCreate, IUserStored } from "../models/User"
// import { faker } from '@faker-js/faker';
const { faker } = require('@faker-js/faker')
var https = require('https');
const mongoose = require('mongoose')
const User = require('./User')
const Tweet = require('./Tweet')
const Liked = require('./Liked')
const Retweet = require('./Retweet')
const { blob_url, blob_acess_key } = require('./secret');
// const { default: Media } = require('./Media');
const Media = require('./Media')

var NUM_USERS = 6
var NUM_TWEETS = 10

function create_users() {
    const Users_array = []
    const TweetsArray = []

    let auth_type = ['google', 'github', 'password']
    // making first users  
    for (var i = 0; i < NUM_USERS; i++) {
        let accounts = new Map()
        for (var j = 0; j < 1 + Math.floor(Math.random() * 1); j++) {
            var a_type = auth_type[Math.floor(Math.random() * auth_type.length)];
            if (a_type === 'github' || a_type === 'google') {
                accounts.set(a_type, { sub: faker.internet.password(5 + Math.floor(Math.random() * 14)) })
            } else {
                accounts.set(a_type, { password: faker.internet.password(5 + Math.floor(Math.random() * 14)) })
            }
        }
        let new_user = {
            name: faker.name.fullName().slice(0, 40),
            user_name: faker.internet.userName().slice(0, 10),
            dob: faker.date.birthdate({ min: 14 }),
            email: faker.internet.email().slice(0, 40),
            // avatar: faker.internet.avatar(),
            about: faker.lorem.paragraphs().slice(0, 150),
            followers: [],
            following: [],

            accounts
        }
        Users_array.push(new_user)
    }
    return Users_array
}

async function UploadUsers(Users_array, blobServiceClient) {
    // console.log(Users_array)
    const user_ids = []
    const users = {}
    await Promise.all(Users_array.map(async (user, index) => {
        // console.log(user)
        const new_user = await User.create(user)
        console.log(new_user._id)
        if (new_user && new_user._id) {
            user_ids.push(new_user._id.toString())
            new_user.avatar = `${blob_url}/${new_user._id.toString()}/avatar`
            // users[new_user._id.toString()] = new_user
            // User.findByIdAndUpdate(new_user._id, { avatar: `${blob_url}/${new_user._id.toString()}/avatar` })
            //     .then(() => { "Sucessfully updated!" })
            //     .catch((err) => { "Some error occured while updating avatar", err })
            UploadImage(blobServiceClient, new_user._id.toString(), 'avatar', 'avatar')
        }

    }))
    // console.log(user_ids)
    return { user_ids, users }
}
function addFollowersFollowings(userIds, users) {
    userIds.forEach((user_id, index) => {
        let followers_index = []
        for (let i = 0; i < Math.floor(Math.random() * userIds.length); i++) {
            let new__ = Math.floor(Math.random() * userIds.length)
            if (new__ !== index && followers_index.findIndex(ele => ele === userIds[new__]) === -1) {
                // console.log(i,index)
                followers_index.push(userIds[new__])
            }
        }
        // console.log(followers_index)
        followers_index.forEach((ind) => {
            // console.log(ind)
            users[user_id]['followers'].push(ind)
            users[ind]['following'].push(user_id)
        })
    })
    return users
}


function create_tweets(userIds, users, num_tweets) {
    const tweets_array = []
    let nTweets = (num_tweets) ? num_tweets : NUM_TWEETS
    for (var i = 0; i < nTweets; i++) {

        let new_tweet = {
            text: faker.lorem.paragraphs().slice(0, 350),
            author: userIds[Math.floor(Math.random() * userIds.length)],
        }
        users[new_tweet.author].num_tweets = (users[new_tweet.author].num_tweets || 0) + 1
        tweets_array.push(new_tweet)
    }
    // console.log(tweets_array , 'original <------ \n\n\n',users)
    return { tweets_array, users }
}

async function UploadTweets(tweets_array, blobServiceClient) {
    // console.log(Users_array)
    const tweet_ids = []
    const tweets = {}
    await Promise.all(tweets_array.map(async (tweet, index) => {
        await Tweet.create(tweet).then(async (new_tweet) => {
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

                tweet_ids.push(new_tweet._id.toString())
                console.log('tweet_id', new_tweet._id, 'num media', numMedia, media)
                new_tweet.media = media
                tweets[new_tweet._id.toString()] = new_tweet


            }
        })
    }))
    // console.log('\n UploadTweets : \n', tweets)
    return { tweet_ids, tweets }
}


var total_comments = 10
function AddCommets(tweets, users, tweets_id,num_comments) {
    // let tweets_id = Object.keys(tweets)
    let users_id = Object.keys(users)
    let comments = []
    console.log(tweets,tweets_id)

    for (var i = 0; i < num_comments ; i++) {
        let random_tweet_id = tweets_id[Math.floor(Math.random() * tweets_id.length)]
        let random_user_id = users_id[Math.floor(Math.random() * users_id.length)]
        // let random_tweet_id = tweets_id[Math.floor(Math.random() * 5)]
        let new_tweet = {
            parent_tweet: random_tweet_id,
            text: faker.lorem.paragraphs().slice(0, 350),
            author: random_user_id,
        }
        comments.push(new_tweet)
        tweets[random_tweet_id].num_comments = (tweets[random_tweet_id].num_comments || 0) + 1
    }
    return { comments, tweets }
}
async function UploadComments(comment_array, tweets) {
    const comment_ids = []
    // const tweets = {}
    for(let tweet of comment_array){
        await Tweet.create(tweet).then((new_tweet) => {
            if (new_tweet && new_tweet._id) {
                comment_ids.push(new_tweet._id.toString())
                tweets[new_tweet._id.toString()] = new_tweet
            }
        })
    }
    
    console.log('UploadComments : ', comment_ids)
    return { comment_ids, tweets }
}

async function ModifyUsers(tweets, users) {
    let userIds = Object.keys(users)
    let tweet_ids = Object.keys(tweets)
    // tweet_ids.forEach((tweet_id) => {
    for (let tweet_id of tweet_ids) {
        // console.log(c_user,tweets[tweet_id]['author'])

        let liked_by = []
        let retweet_by = []
        for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
            let new__ = Math.floor(Math.random() * userIds.length)
            if (liked_by.findIndex(ele => ele === userIds[new__]) === -1) {
                liked_by.push(userIds[new__])
                await Liked.create({
                    userId: userIds[new__],
                    tweetId: tweet_id,
                })
            }
        }
        for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
            let new__ = Math.floor(Math.random() * userIds.length)
            if (retweet_by.findIndex(ele => ele === userIds[new__]) === -1) {
                retweet_by.push(userIds[new__])
                await Retweet.create({
                    userId: userIds[new__],
                    tweetId: tweet_id,
                })
            }
        }
        tweets[tweet_id].num_likes = liked_by.length
        tweets[tweet_id].num_retweet = retweet_by.length
        await Tweet.findByIdAndUpdate(tweet_id, tweets[tweet_id])

    }
    console.log('Modify Tweets', tweets)
    return users
}
async function UpdateUsers(users) {
    await Promise.all(Object.keys(users).map(async (user_id) => {
        await User.findByIdAndUpdate(user_id, users[user_id])
    }))
    // console.log('Update Users',users)
}

async function CreateMedia(blobServiceClient, tweet_id, author_id, index) {
    const new_media = await Media.create({
        author: author_id,
        parent_tweet: tweet_id,
        url: `${blob_url}/${author_id.toString()}/${tweet_id.toString()}_${index}`
    })
    if (new_media && new_media._id) {
        UploadImage(blobServiceClient, author_id.toString(), `${tweet_id.toString()}_${index}`, 'tweet', new_media._id)
        console.log("Returning new_media_id")
        return new_media._id
    } else {
        return null
    }
}
function UploadImage(blobServiceClient, container_name, blob_name, file_type, media_id) {
    let img_url = ""
    const containerClient = blobServiceClient.getContainerClient(container_name);

    if (file_type === 'avatar') {
        let random = Math.random()
        let type = (random>0.6)?'women':'men'
        img_url = `https://randomuser.me/api/portraits/${type}/${Math.floor(random*80)}.jpg`
        console.log(img_url)
        https.get(img_url, function (res) {
            var data = [];
            const contentType = res.headers['content-type'];
            // console.log(res)
            // console.log(contentType)

            res.on('data', function (chunk) {
                data.push(chunk);
            }).on('end', function () {
                //at this point data is an array of Buffers
                //so Buffer.concat() can make us a new Buffer
                //of all of them together
                var buffer = Buffer.concat(data);
                // console.log(buffer.toString('base64'));


                containerClient.createIfNotExists({
                    access: 'blob',
                }).then(() => {
                    const blockBlobClient = containerClient.getBlockBlobClient(blob_name);
                    // context.log(`got the blokClient`);
                    // await blockBlobClient.uploadStream(binary_file);
                    blockBlobClient.upload(buffer, buffer.byteLength, {
                        tags: {
                            content_type: contentType
                        },
                        blobHTTPHeaders: {
                            blobContentType: contentType
                        }
                    }).then(() => {
                        console.log("Succesffully uploaded avatar!")
                    }).catch(() => {
                        console.log("SOme erro occured while uploading blob")
                    })
                }).catch((err) => {
                    console.log("Some err occured could not create container", err)
                })
            });
        });
    } else {
        const filePath = `/home/siddhant/Desktop/data/animal-imgs/${Math.floor(Math.random() * 14) + 1}.jpg`
        console.log(filePath)
        containerClient.createIfNotExists({
            access: 'blob',
        }).then(() => {
            const blockBlobClient = containerClient.getBlockBlobClient(blob_name);
            // context.log(`got the blokClient`);
            // await blockBlobClient.uploadStream(binary_file);
            blockBlobClient.uploadFile(filePath, {
                blobHTTPHeaders: {
                    blobContentType: 'image/jpeg'
                }
            }).then(() => {
                console.log('media_id', media_id)
                if (media_id) {
                    Media.findByIdAndUpdate(media_id, {
                        // size: ,
                        uploaded: true,
                        type: 'image/jpeg',
                    }).then(() => {
                        console.log("Sucessfully updated media!")
                    }).catch((err) => {
                        console.log("Unable to update media")
                    })
                }
                console.log("Succesffully uploaded!")
            }).catch((err) => {
                console.log("SOme erro occured while uploading blob", err)
            })
        }).catch((err) => {
            console.log("Some err occured could not create container", err)
        })
    }
}
async function GetUsers() {
    const Users_array = await User.find({})
    let users = {}
    for(let user of Users_array){
        users[user._id.toString()] = user
    }
    return users
}
async function DeleteUsers() {

}

module.exports = {
    UploadUsers, create_users, addFollowersFollowings, create_tweets, ModifyUsers,
    UploadTweets, UpdateUsers, AddCommets, UploadComments, UploadImage, GetUsers, CreateMedia
}