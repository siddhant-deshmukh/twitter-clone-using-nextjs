import { Inter } from '@next/font/google'
import Layout from "../../components/desktop/layout"
import { NextPageWithLayout } from '../_app'
import { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ITweet } from '../../models/Tweet'
import TweetPage from '../../components/tweet/TweetPage'
import { useQueryClient } from 'react-query'
import AppContext from '../../context/TwitterContext'
import { ITwitterContext } from '../../types'


const Home: NextPageWithLayout = () => {
    const router = useRouter()
    const {tweet_id, tweetPageNum, tweetIndex} = router.query
    const [tweetData, setTweetData] = useState<ITweet | null>(null)

    const queryClient = useQueryClient()
    
    const {modal} = router.query 
    const {modalOn,openModal,closeModal} = useContext(AppContext) as ITwitterContext
    useEffect(()=>{
        if(modal === "liked_by" && !modalOn){
            openModal({title:"Liked by",url:"/liked_by",parameters:{tweet_id},type:"liked_by"})
        }
        if(modal === "retweeted_by" && !modalOn){
            openModal({title:"Retweeted by",url:"/retweeted_by",parameters:{tweet_id},type:"retweeted_by"})
        }
        if(!modal && modalOn){
            closeModal({goBack:false})
        }
    },[modal,modalOn,tweet_id])
    useEffect(() => {
        if(tweet_id){
            const state = queryClient.getQueryState(["TweetFeed"])
            if(state && tweetPageNum && tweetIndex){
                //@ts-ignore
                const currentPage = state?.data?.pages[parseInt(tweetPageNum as string)]
                const cachedTweet = currentPage.results[parseInt(tweetIndex  as string)]
                console.log("|||||", cachedTweet)
                setTweetData(cachedTweet)
            }
            else{
                fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet/${tweet_id}`,{method:'GET'})
                    .then(res=>res.json())
                    .then(data=>{
                        //console.log(data)
                        console.log(data.tweet)
                        setTweetData(data.tweet)
                })
            }
        }
    }, [tweet_id,setTweetData,queryClient])
    
    return (
        <>
          {
            tweetData && 
            <TweetPage TweetData={tweetData} queryClient={queryClient} tweetPageNum={tweetPageNum as string|undefined} tweetIndex={tweetIndex as string|undefined}/>
          }
          {
            !tweetData &&
            <div style={{ width: 500 }}>Loading....</div>
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
