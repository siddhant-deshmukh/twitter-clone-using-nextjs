const { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
const mongoose = require('mongoose')
const { } = require('./functions')
const { mongo_url, blob_url, blob_acess_key,blob_account_name } = require('./secret')
const { create_users, UploadImage, addFollowersFollowings, create_tweets, ModifyUsers, UploadTweets, UpdateUsers, AddCommets, UploadComments } = require('./functions')

const User = require('./User')
const Tweet = require('./Tweet')
const Liked = require('./Liked')
const Retweet = require('./Retweet')
const Media = require('./Media')

const sharedKeyCredential = new StorageSharedKeyCredential(blob_account_name, blob_acess_key);
const blobServiceClient = new BlobServiceClient(blob_url, sharedKeyCredential);


if(require.main === module){
    mongoose.connect(mongo_url)
    .then(async () => {
        let users_array = create_users()
        
        let res__ = await UploadUsersSlow(users_array,blobServiceClient)
        let userids = res__.user_ids
        let users = res__.users
        users = addFollowersFollowings(userids, users)

        await UpdateUsersSlowly(users)
    })
}

async function UploadUsersSlow(Users_array, blobServiceClient) {
    const user_ids = []
    const users = {}

    for(let user of Users_array){
        const new_user = await User.create(user)
        console.log(new_user._id)
        if (new_user && new_user._id) {
            user_ids.push(new_user._id.toString())
            new_user.avatar = `${blob_url}/${new_user._id.toString()}/avatar`
            users[new_user._id.toString()] = new_user
            UploadImage(blobServiceClient, new_user._id.toString(), 'avatar', 'avatar')
        }
    }
    // console.log('user_ids',user_ids)

    return { user_ids : user_ids, users }
}
async function UpdateUsersSlowly(users) {
    for(let user_id of Object.keys(users)){
        await User.findByIdAndUpdate(user_id, users[user_id])
    }
}

module.exports = {UpdateUsersSlowly}