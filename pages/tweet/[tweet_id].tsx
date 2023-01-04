import { Inter } from '@next/font/google'
import Layout from "../../components/desktop/layout"
import { NextPageWithLayout } from '../_app'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ITweet } from '../../models/Tweet'
import TweetPage from '../../components/tweet/TweetPage'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPageWithLayout = () => {
    const router = useRouter()
    const { tweet_id } = router.query
    const [tweetData, setTweetData] = useState<ITweet | null>(null)

    useEffect(() => {
        if(tweet_id){
            console.log(tweet_id)
            fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet/${tweet_id}`,{method:'GET'})
                .then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    console.log(data.tweet)
                    setTweetData(data.tweet)
                })
        }
    }, [tweet_id,setTweetData])
    
    return (
        <>
          {
            tweetData && 
            <TweetPage TweetData={tweetData}/>
          }
        </>
    )
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Home
