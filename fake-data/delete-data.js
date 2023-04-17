const { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
const mongoose = require('mongoose')
const { } = require('./functions')
const { mongo_url, blob_url, blob_acess_key, blob_account_name } = require('./secret')

const User = require('./User')
const Tweet = require('./Tweet')
const Liked = require('./Liked')
const Retweet = require('./Retweet')
const Media = require('./Media')

const sharedKeyCredential = new StorageSharedKeyCredential(blob_account_name, blob_acess_key);
const blobServiceClient = new BlobServiceClient(blob_url, sharedKeyCredential);

mongoose.connect(mongo_url)
    .then(async () => {
        console.log("Connected to database")
        // DeleteBlobData().finally(() => {
        //     console.log('Finished! DeleteBlobData')
        // })
        DeleteMongoData().finally(() => {
            console.log('Finished! DeleteMongoData')
        })
    })

async function DeleteMongoData() {
    // await User.deleteMany({})
    await Tweet.deleteMany({})
    await Liked.deleteMany({})
    await Retweet.deleteMany({})
    await Media.deleteMany({})
}
async function DeleteBlobData() {

    for await (const containerItem of blobServiceClient.listContainers({
        includeDeleted: false,
        includeMetadata: false,
        includeSystem: true,
        prefix: ''
    })) {

        // ContainerItem
        console.log(`For-await list: ${containerItem.name}`);

        // ContainerClient
        if (containerItem.name && containerItem.name.length === 24) {
            const response = await blobServiceClient.deleteContainer(containerItem.name);
            if (!response.errorCode) {
                console.log(`deleted ${containerItem.name} container`);
            } else {
                console.log(`unable to delete`);
            }
        }

    }
}