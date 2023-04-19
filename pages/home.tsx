import Head from 'next/head'
import Tweet from '../components/Tweet/FeedTweetComponent'
import { ITweet } from '@/models/Tweet'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import useSWRInfinite from "swr/infinite";
import { useSWRConfig } from 'swr'
import useSWR from 'swr'
import { AuthContext } from '@/context/authContext';
import Loading from '@/components/Loading';
import TweetEditor from '@/components/Tweet/TweetEditor';
import TopNavBar from '@/components/Layout/TopNavbar';

const pageLength = 5
export default function Home() {
  const { refreshInterval, cache, mutate } = useSWRConfig()
  const { authState, setAuthState } = useContext(AuthContext)
  const [hasMore, setHasMore] = useState<boolean>(true)

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
    if (data.length === 0) {
      setHasMore(false)
    }
    const tweetIds = data.map((tweet: ITweet) => {

      const exist_ = cache
      //@ts-ignore
      if (!exist_ || !exist_._id) {
        //@ts-ignore
        cache.set(`tweet/${tweet._id}`, tweet)
      }
      return tweet._id
    })
    console.log("data", url, tweetIds)
    return tweetIds
  }, [cache, setHasMore, setAuthState])

  const { data: ownTweets, mutate: mutateOwnTweets } = useSWR('/own/tweetfeed', (str: string) => {
    const feed = cache.get('own/tweetfeed')
    return feed
  }, {
    revalidateOnFocus: true,
  })
  const { data: TweetFeed, mutate: mutateTweetFeed, size, setSize, isValidating, isLoading: TweetFeedLoading } = useSWRInfinite(
    (index) => `/api/tweet?skip=${index * pageLength}&limit=${pageLength}`,
    fetchTweetFeed,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  // const TweetFeed = data ? data.concat(...data) : [];
  const updateTweet = useCallback((tweet_id: string, what: 'liked' | 'retweet') => {
    let prev = cache.get(`tweet/${tweet_id}`) as ITweet
    if (!prev || !prev._id) return;
    let updated_tweet = { ...prev };
    if (what === 'liked') {
      updated_tweet = {
        ...updated_tweet,
        have_liked: (prev.have_liked) ? (false) : true,
        num_likes: (!prev.have_liked) ? (prev.num_likes + 1) : (prev.num_likes - 1)
      }
      console.log('liked')
    }
    if (what === 'retweet') {
      updated_tweet = {
        ...updated_tweet,
        have_retweeted: (prev.have_retweeted) ? (false) : true,
        num_retweet: (!prev.have_retweeted) ? (prev.num_retweet + 1) : (prev.num_retweet - 1)
      }
    }
    //@ts-ignore
    cache.set(`tweet/${tweet_id}`, updated_tweet)

  }, [cache])

  const load_more = useRef(null)
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    console.log("Is intersection!", isValidating, hasMore)
    if (target.isIntersecting && (!isValidating) && hasMore) {
      console.log("Get ready!")
      setSize(size + 1)
    }
  }, [size, hasMore, setSize, isValidating])
  useEffect(() => {
    console.log(cache)
  }, [cache])
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.25
    })
    if (load_more && load_more.current) observer.observe(load_more.current);
    return () => {
      if (load_more.current) observer.unobserve(load_more.current);
    }
    // console.log('Cache', cache)

  }, [observerCallback])
  return (
    <div className='w-full'>
      <Head>
        <title>Home / Twitter</title>
      </Head>
      <h1 className='hidden sm:flex  w-full space-x-10 p-3 sticky top-0 z-50 bg-opacity-80 bg-white dark:bg-black dark:bg-opacity-80'>
        <span className='text-xl font-semibold'>
          Home
        </span>
      </h1>
      <h1 className='flex sm:hidden  w-full space-x-10 p-2 sticky top-0 z-50 bg-opacity-80 bg-white dark:bg-black dark:bg-opacity-80'>
        { 
          authState &&
          <TopNavBar authState={authState}/>
        }
      </h1>
      <div className="w-full">
        <TweetEditor />
        {/* < FeedTweetEditor mutateOwnTweets={mutateOwnTweets} /> */}
        {/* {
          JSON.stringify(ownTweets)
        } */}
        {
          ownTweets &&
          //@ts-ignore
          ownTweets.map((tweet_id: string, indexNum) => {
            return <div key={tweet_id}>

              {tweet_id && <Tweet tweet_id={tweet_id} />}
            </div>
          })
        }

        {
          TweetFeed &&
          TweetFeed.map((page: string[] | [], pageNum) => {
            if (!page) return <div></div>
            return page.map((tweet_id: string, indexNum) => {
              return <div key={tweet_id}>

                {tweet_id && <Tweet tweet_id={tweet_id} />}
              </div>
            })
          })
        }
      </div>
      {/* <button onClick={() => setSize(size + 1)}>Load More</button> */}
      {
        isValidating &&
        <div className='w-fit mx-auto mt-5'>
          <Loading />
        </div>
      }
      <div ref={load_more}></div>
    </div>
  )
}
