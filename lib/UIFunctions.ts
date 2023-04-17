import { IMedia } from "@/models/Media";
import { ITweet } from "@/models/Tweet";
import { IUser, IUserSnippet } from "@/models/User";
import { Cache } from "swr";
import { ScopedMutator } from "swr/_internal";

export function CacheNewTweet(
    authState: IUser | null, text: string, mediaFiles: IMedia[],
    cache: Cache<any>, mutate: ScopedMutator<any>, parent_tweet_id?: string,
) {
    if (!authState) return;
    let prev  = []
    if(parent_tweet_id){
        //@ts-ignore
        prev = cache.get(`own_comment/${parent_tweet_id}`)
    }else{
        //@ts-ignore
        prev = cache.get('own/tweetfeed')
    }
    // (parent_tweet_id) ? cache.get('own/tweetfeed') : cache.get(`own_comment/${parent_tweet_id}`)

    console.log('previous cache!',prev,typeof parent_tweet_id)
    let text_ = text.replaceAll('<br>', '\n').replaceAll('&nbsp', '')
    let new_tweet: ITweet = {
        _id: 'new_' + Math.floor(Math.random() * 100000).toString(),
        parent_tweet: (parent_tweet_id) ? parent_tweet_id : null,
        num_comments: 0,
        num_likes: 0,
        num_quotes: 0,
        num_retweet: 0,
        num_views: 0,
        author: authState?._id.toString(),
        text: text_,
        media: mediaFiles,
        //@ts-ignore
        time: Date.now(),
        have_liked: false,
        have_retweeted: false,
    }
    let new_ = []
    if (prev && Array.isArray(prev)) {
        new_ = [new_tweet._id].concat(prev)
    } else {
        new_ = [new_tweet._id]
    }
    console.log('later cache!',new_)

    if (parent_tweet_id) {
        //@ts-ignore
        cache.set(`own_comment/${parent_tweet_id}`, new_)

        mutate(`/own_comment/${parent_tweet_id}`)
    } else {
        //@ts-ignore
        cache.set('own/tweetfeed', new_)

        mutate('/own/tweetfeed')
    }
    //@ts-ignore
    cache.set(`tweet/${new_tweet._id}`, new_tweet)
    // console.log('!!!!!!!',new_tweet,cache.get(`tweet/${new_tweet._id}`),cache.get('own/tweetfeed'))
    // let editor = document.getDocumentB('tweet-editor-feed')

}