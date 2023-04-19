import Head from 'next/head'
import { useRouter } from 'next/router'
import useUserCache from '@/hooks/useUserCache'
import UserDetails from '@/components/UserDetails'
import { useSWRConfig } from 'swr'
import { useCallback, useContext, useState } from 'react'
import { ITweet } from '@/models/Tweet'
import useSWR from 'swr'
import useSWRInfinite from "swr/infinite";
import { AuthContext } from '@/context/authContext'
import Tweet from '@/components/Tweet/FeedTweetComponent'
import Loading from '@/components/Loading'

export default function UserPage() {
    const router = useRouter()
    const { user_id } = router.query
    // console.log(user_id)

    if (!user_id) {
        return (
            <div className='w-full'>
                <Head>
                    <title>Twitter</title>
                </Head>


                <div className='w-full py-5'>
                    <Loading size={8} />
                </div>
            </div>
        )
    } else {
        return (
            <div className='w-full'>

                <h1 className='flex w-full space-x-10 p-3 sticky top-0 z-50 bg-opacity-80 bg-white dark:bg-gray-900 dark:bg-opacity-80'>
                    <button
                        onClick={(event) => { event.preventDefault(); router.back() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <span className='text-xl font-semibold'>
                        User
                    </span>
                </h1>
                <UserInfo author_id={user_id} />
                <UserTweetFeed author_id={user_id} />
            </div>
        )
    }
}

function UserInfo({ author_id }: { author_id: string | string[] }) {
    const { authorDetails, loading: authorLoading, error: authorError } = useUserCache(author_id as string | undefined)
    const router = useRouter()

    if (authorDetails) {
        return (
            <div className='w-full'>
                <Head>
                    <title>{authorDetails.name || 'Twitter'} @({authorDetails.user_name}) / Twitter</title>
                </Head>


                <div className="w-full">
                    {
                        <UserDetails authorDetails={authorDetails} />
                    }
                </div>

            </div>
        )
    } else if (authorError) {
        return (
            <div className='w-full'>
                <div className='py-10 px-5 w-full text-center text-red-500'>Some Error Occured</div>
            </div>
        )
    } else {
        return (
            <div className='w-full'>
                <div className='w-full'>
                    <Loading />
                </div>
            </div>
        )
    }
}
function UserTweetFeed({ author_id }: { author_id: string | string[] }) {
    const { authorDetails, loading: authorLoading, error: authorError } = useUserCache(author_id as string | undefined)
    const router = useRouter()
    const { refreshInterval, cache, mutate } = useSWRConfig()
    const { authState, setAuthState } = useContext(AuthContext)
    const pageLength = 5
    const [feedType, setType] = useState<'tweet' | 'like' | 'media'>('tweet')
    const fetchTweetFeed = useCallback(async (url: string) => {
        const data = await fetch(url, {
            credentials: 'include',
            method: 'GET'
        }).then((res) => {
            if (res.status === 401) {
                setAuthState(null)
                return null;
            }
            return res.json()
        });
        const tweetIds = data.map((tweet: ITweet) => {

            const exist_ = cache
            //@ts-ignore
            if (!exist_ || !exist_._id) {
                //@ts-ignore
                cache.set(`tweet/${tweet._id}`, tweet)
            }
            return tweet._id
        })
        // console.log("data", url, tweetIds)
        return tweetIds
    }, [cache])
    const { data: ownTweets } = useSWR('/own/tweetfeed', (str: string) => {
        if (author_id === authState?._id.toString()) {
            const feed = cache.get('own/tweetfeed')
            return feed
        }
        return []
    })

    const { data: TweetFeed, mutate: mutateTweetFeed, size, setSize, isValidating: TwwetFeedValidating, isLoading } = useSWRInfinite(
        (index) => `/api/user/${author_id}/feed?skip=${index * pageLength}&limit=${pageLength}`,
        fetchTweetFeed,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )
    const { data: LikedTweetFeed, isValidating: LikedFeedValidating } = useSWRInfinite(
        (index) => `/api/user/${author_id}/feed?skip=${index * pageLength}&limit=${pageLength}&type=liked`,
        fetchTweetFeed,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )
    return (
        <div className='w-full'>
            <div className='flex w-full justify-between h-14 font-medium text-gray-600 dark:text-gray-300'>
                <button
                    className={`w-full relative hover:bg-gray-200 dark:hover:bg-gray-800 ${(feedType === 'tweet') ? "text-black dark:text-white" : ''}`}
                    onClick={(event) => { event.preventDefault(); setType('tweet') }}>
                    Tweets
                    <div className={`absolute bottom-0 left-1/3 w-1/3 h-1 rounded-sm bg-blue-400 ${(feedType !== 'tweet') ? "hidden" : 'block'}`}></div>
                </button>
                <button
                    className={`w-full relative hover:bg-gray-200 dark:hover:bg-gray-800 ${(feedType === 'like') ? "text-black dark:text-white" : ''}`}
                    onClick={(event) => { event.preventDefault(); setType('like') }}>
                    Liked
                    <div className={`absolute bottom-0 left-1/3 w-1/3 h-1 rounded-sm bg-blue-400 ${(feedType !== 'like') ? "hidden" : 'block'}`}></div>
                </button>
            </div>

            {
                feedType === 'tweet' && ownTweets &&
                //@ts-ignore
                ownTweets.map((tweet_id: string, indexNum) => {
                    return <div key={tweet_id}>

                        {tweet_id && <Tweet tweet_id={tweet_id} />}
                    </div>
                })
            }
            {
                feedType === 'tweet' && TweetFeed &&
                TweetFeed.map((page: string[] | [], pageNum) => {
                    if (!page) return <div></div>
                    return page.map((tweet_id: string, indexNum) => {
                        return <div key={tweet_id}>

                            {tweet_id && <Tweet tweet_id={tweet_id} />}
                        </div>
                    })
                })
            }
            {
                feedType === 'like' && LikedTweetFeed &&
                LikedTweetFeed.map((page: string[] | [], pageNum) => {
                    if (!page) return <div></div>
                    return page.map((tweet_id: string, indexNum) => {
                        return <div key={tweet_id}>

                            {tweet_id && <Tweet tweet_id={tweet_id} />}
                        </div>
                    })
                })
            }
            {
                (LikedFeedValidating || TwwetFeedValidating) &&
                <div className='w-fit mx-auto mt-5'>
                    <Loading />
                </div>
            }
        </div>
    )
}