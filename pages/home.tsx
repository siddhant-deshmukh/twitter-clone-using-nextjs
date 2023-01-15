import Layout from "../components/desktop/layout"
import { NextPageWithLayout } from './_app'
import { ReactElement, useState} from 'react'
import TweetEditor from '../components/TweetEditor'
import TweetCard from '../components/tweet/TweetCard'
import { ITweet, ITweetFileAttachments } from '../models/Tweet'
import { useInfiniteQuery, useQueryClient} from "react-query"
import InfiniteScroll from "react-infinite-scroller"


const Home : NextPageWithLayout= () =>{

  const fetchTweetFeed = async ({ pageParam = 0 }) => {
    //console.log(pageParam)
    const tweetsPerPage : number = 10
    const startingTweetIndex : number = tweetsPerPage*pageParam
    const lastTweetIndex : number = tweetsPerPage*pageParam + 9
    const response = await fetch(
      `/api/tweet?startingAt=${pageParam}&inTotal=10`
    );
    const results = await response.json();
    console.log(results)
    return { results, nextPage: pageParam + tweetsPerPage,tweetsPerPage,startingTweetIndex,lastTweetIndex };
  };

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useInfiniteQuery({
      queryKey: ["TweetFeed"], 
      queryFn:fetchTweetFeed, 
      staleTime:1000*60*10,
      // keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => {
        //console.log(lastPage.results.length , lastPage.nextPage)
        if (lastPage.results.length > 0) return lastPage.nextPage;
        return undefined;
      }
  });

  const queryClient = useQueryClient()
  return (
    <>
      <main className='w-fit'>
        <div className='font-semibold py-2 '>Home</div>
        <TweetEditor />
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
          <div> <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
            { 
              data && data?.pages.map((page,tweetPageNum:number)=>
                page.results.map((tweet : ITweet,tweetIndex:number )=>
                  <div key={tweet._id}>
                    {/**@ts-ignore */}
                    <TweetCard TweetData={tweet} queryClient={queryClient} tweetIndex={tweetIndex} tweetPageNum={tweetPageNum}/>
                  </div>
                )
              )
            }
            </InfiniteScroll>
          </div>
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
