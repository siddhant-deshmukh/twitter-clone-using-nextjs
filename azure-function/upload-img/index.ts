import { Context, HttpRequest } from '@azure/functions';
import { BlobServiceClient, HttpRequestBody, StorageSharedKeyCredential } from '@azure/storage-blob'
import HTTP_CODES from "http-status-enum";
import { verify } from 'jsonwebtoken'
import * as db from '../lib/cosmosdb-mongodb';

const accountName = process.env["ACCOUNT_NAME"];
const accountKey = process.env["ACCOUNT_KEY"];
// const containerName = "avatar";
const MaximumFileSize = 1 * 1024 * 1024
const jwtTokenKey = process.env.JWT_TOKEN_KEY 
module.exports = async function (
    context: Context,
    req: HttpRequest
) {
    // if( !req.body )
    // Create a BlobServiceClient object with a StorageSharedKeyCredential
    try {
        await db.init();

        let content_length = req.headers["content-length"]
        let content_type = req.headers["content-type"]
        let cookie_string = req.headers["cookie"]
        let media_id = req.query?.media_id

        let cookies_value_to_value = cookie_string?.split(';').map((v: string) => v.split('='))
        let cookie = {}
        Object.values(cookies_value_to_value).forEach((arr: string[]) => {
            cookie[arr[0].trim()] = arr[1].trim()
        })
        // context.log(`\nCookies`, cookie)

        let token = cookie['auth-token']

        if (!content_length || parseInt(content_length) > MaximumFileSize ||
            !content_type || content_type !== "application/octet-stream" ||
            !cookie || !token || !req.body) {
            context.res.body = {
                msg: 'incorrect headers check content-length, content-type, cookie type of auth-token',
                reqHeader: req.headers
            }
            context.res.status = HTTP_CODES.BAD_REQUEST
            // context.log(`Here in the req above token`, !content_length, content_length > MaximumFileSize,
            //     !content_type, content_type !== "application/octet-stream",
            //     !cookie, !cookie['auth-token'], req.headers.cookie);

            return;
        }
        if (!media_id) {
            context.res.body = {
                msg: 'filname is no given',
                reqHeader: req.headers
            }
            context.res.status = HTTP_CODES.BAD_REQUEST
            return;
        }
        // context.log(`Here in the req above token`, media_id, cookie['auth-token'], token, req.headers.cookies);
        // let token = cookie['auth-token']


        //  --------------------                    checking token and user (authentication)    ------------------------------
        let decoded = verify(token, jwtTokenKey);
        if (typeof decoded === 'string' || !decoded._id) {
            context.res.body = {
                msg: 'invalid token',
                reqHeader: req.headers
            }
            context.res.status = HTTP_CODES.NOT_ACCEPTABLE
            return;
        }
        let check_media = await db.findMediaById(media_id)
        // context.log(`Media`, check_media);
        if (!check_media) {
            context.res.body = {
                msg: 'Incorrect Media Id',
            }
            context.res.status = HTTP_CODES.BAD_REQUEST
            return;
        }
        if (check_media.author.toString() !== decoded._id) {
            context.res.body = {
                msg: 'Acess denied!',
                reqHeader: req.headers
            }
            context.res.status = HTTP_CODES.FORBIDDEN
            return;
        }
        // context.log(`Here in the req`, req.headers, req.headers.cookie['auth-token']);

        const binary_file = Buffer.from(req.body, 'binary');
        if(binary_file.byteLength > MaximumFileSize){
            context.res.body = {
                msg: 'File length is larger than 1MB',
                // reqHeader: req.headers
            }
            context.res.status = HTTP_CODES.FORBIDDEN
            return;
        }
        // context.log(`\nComing till here!\n`);

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        // context.log(`\nHere about to do it\n`,sharedKeyCredential);
        // const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
        const blobServiceClient = new BlobServiceClient(`http://127.0.0.1:10000/${accountName}`, sharedKeyCredential);

        let containerName =  check_media.url.split('/').at(-2) //'642d3f22d3e736c9a3b63a62' //
        let fileType = check_media.type.split('/').at(-1)
        let blobName = check_media.url.split('/').at(-1) // + '.' + fileType
        // Get a reference to a container client
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        await containerClient.createIfNotExists({
            access : 'blob',
        })
        // context.log(`Here about to do it`);

        // console.log(binary_file)
        // context.log('Did it!', containerName, blobName,fileType);

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // context.log(`got the blokClient`);
        // await blockBlobClient.uploadStream(binary_file);
        const uploadBlobResponse = await blockBlobClient.upload(binary_file, binary_file.byteLength ,{
            tags : {
                content_type : check_media.type
            },
            blobHTTPHeaders : {
                blobContentType : check_media.type
            }
        })
        if(uploadBlobResponse){
            db.markMediaUploaded(media_id)
        }
        // Return a success response
        context.res = {
            status: 200,
            body: {
                msg: 'File uploaded successfully',
                // requestHeader:req.body,
                length: 'binary_file',
                // reqHeader: req.headers
                // uploadBlobResponse : uploadBlobResponse,
            },
        };

    } catch (err) {
        context.res = {
            status: 500,
            body: {
                msg: 'Something wrong',
                error: err
            },
        };
    }
};
