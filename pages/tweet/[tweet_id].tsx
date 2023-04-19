import Head from 'next/head'
import { TweetComponent } from '../../components/Tweet/TweetComponent'
import { useRouter } from 'next/router'
import useTweetsCache from '@/hooks/useTweetsCache'
import { useCallback, useContext } from 'react'
import { AuthContext } from '@/context/authContext'
import useSWR, { useSWRConfig } from 'swr'
import useSWRInfinite from "swr/infinite";
import Tweet from '@/components/Tweet/FeedTweetComponent'
import { ITweet } from '@/models/Tweet'
import useUserCache from '@/hooks/useUserCache'
import Loading from '@/components/Loading'
import TweetEditor from '@/components/Tweet/TweetEditor'


export default function TweetPage() {
  const router = useRouter()
  const { tweet_id } = router.query
  const { tweet, loading, updateTweet, error: TweetError } = useTweetsCache(tweet_id)
  const { authorDetails, loading: authorLoading, error: authorError } = useUserCache(tweet?.author)

  console.log(TweetError)
  if (tweet && tweet._id && tweet_id && typeof tweet_id === 'string' && !TweetError) {
    return (
      <div className='w-full'>
        <Head>
          <title>{(authorDetails?.name) ? (authorDetails?.name + ' on') : ''}  Twitter</title>
        </Head>
        <h1 className='flex w-full space-x-10 p-3 sticky top-0 z-50 bg-opacity-80 bg-white dark:bg-black'>
          <button
            onClick={(event) => { event.preventDefault(); router.back() }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <span className='text-xl font-semibold'>
            Tweet
            {/* {tweet_id} */}
          </span>
        </h1>
        <div className="">

          <div>
            <TweetComponent tweet_id={tweet_id} tweet={tweet} updateTweet={updateTweet} />
            < TweetEditor parent_tweet_author={tweet?.author} parent_tweet_id={tweet_id} />
            <CommentFeed tweet_id={tweet_id} />
          </div>


        </div>
      
      </div>
    )
  } else if (TweetError) {
    return (
      <div className='w-full'>
        <div className='py-10 px-5 w-full text-center text-red-500'>Some Error Occured</div>
      </div>
    )
  } else {
    return <div className='w-full  py-5'>
      <Loading size={8} />
    </div>
  }
}

const CommentFeed = ({ tweet_id }: { tweet_id: string }) => {
  const { refreshInterval, cache, mutate } = useSWRConfig()
  const { authState } = useContext(AuthContext)
  const pageLength = 5
  const { setAuthState } = useContext(AuthContext)

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

  // const { data: ownComments } = useSWR(`/own_comment/${tweet_id}`, (str: string) => {


  //     const feed = cache.get(str)
  //     console.log(str, feed)
  //     return feed

  // })
  const { data: ownComments } = useSWR(`/own_comment/${tweet_id}`, (str: string) => {
    const feed = cache.get(`own_comment/${tweet_id}`)
    // console.log("Here in own comment!", feed)
    return feed
  }, {
    revalidateOnFocus: true,
  })
  // const { data: ownTweets, mutate: mutateOwnTweets } = useSWR('/own/tweetfeed', (str: string) => {
  //     const feed = cache.get('own/tweetfeed')
  //     return feed
  // }, {
  //     revalidateOnFocus: true,
  // })
  const { data: CommentsFeed, mutate: mutateTweetFeed, size, setSize, isValidating, isLoading } = useSWRInfinite(
    (index) => `/api/tweet/${tweet_id}/comment?skip=${index * pageLength}&limit=${pageLength}`,
    fetchTweetFeed,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  return (
    <>
      <div>
        {
          //@ts-ignore
          ownComments !== undefined && Array.isArray(ownComments) && <div>
            {ownComments.map((tweet_id: string, indexNum) => {
              return <div key={tweet_id}>

                {tweet_id && <Tweet tweet_id={tweet_id} />}
              </div>
            })}
            {/* {
                            JSON.stringify(ownComments)
                        } */}
          </div>
        }
        {
          CommentsFeed &&
          CommentsFeed.map((page: string[] | [], pageNum) => {
            if (!page) return <div></div>
            return page.map((tweet_id: string, indexNum) => {
              return <div key={tweet_id}>

                {tweet_id && <Tweet tweet_id={tweet_id} />}
              </div>
            })
          })
        }
        {
          isValidating &&
          <div className='w-fit mx-auto mt-5'>
            <Loading />
          </div>
        }
      </div>

    </>
  )
}