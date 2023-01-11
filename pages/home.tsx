import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from "../components/desktop/layout"
import { NextPageWithLayout } from './_app'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import SideBar from '../components/desktop/SideBar'
import LoginBtn from '../components/login-button'
import TweetEditor from '../components/TweetEditor/index'
import TweetCard from '../components/tweet/TweetCard'
import { ITweet } from '../models/Tweet'
const inter = Inter({ subsets: ['latin'] })
import { useInfiniteQuery} from "react-query"
import InfiniteScroll from "react-infinite-scroller"


const Home : NextPageWithLayout= () =>{

  // const [tweetList,setTweetList] = useState<ITweet[]>([])
  // useEffect(()=>{
  //   fetch(`/api/tweet?startingAt=0&inTotal=15`,{method:"GET"})
  //     .then(res=>res.json())
  //     .then(data=>{
  //       console.log(data)
  //       if(!data.msg){
  //         setTweetList(data)
  //       }
  //     })
  // },[setTweetList])
  const fetchPosts = async ({ pageParam = 0 }) => {
    //console.log(pageParam)

    const response = await fetch(
      `/api/tweet?startingAt=${pageParam}&inTotal=10`
    );
    const results = await response.json();
    console.log(results)
    return { results, nextPage: pageParam + 10,totalPages: 100 };
  };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useInfiniteQuery(["posts"], fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      //console.log(lastPage.results.length , lastPage.nextPage)
      if (lastPage.results.length > 0) return lastPage.nextPage;
      return undefined;
    },
    keepPreviousData: true,
  });
  return (
    <>
      <main>
        <div className='font-semibold py-2'>Home</div>
        <TweetEditor motive='tweet' />
        {/* <div>
          {tweetList && tweetList.map((tweet,index)=>{
            return <div key={index}>
                <TweetCard TweetData={tweet}/>
              </div>
          })}
        </div> */}
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>There was an error</p>
        ) : (
          //@ts-ignore
          <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
            { 
              data && data?.pages.map((page)=>
                page.results.map((tweet : ITweet )=>
                  <div key={tweet._id}>
                    <TweetCard TweetData={tweet}/>
                  </div>
                )
              )
            }
          </InfiniteScroll>
        )}
        
      </main>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement){
  return(
    <Layout >
      {page}
    </Layout>
  )
}

export default Home
