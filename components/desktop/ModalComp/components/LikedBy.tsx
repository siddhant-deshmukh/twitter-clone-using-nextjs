import React from 'react'
import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import { IUserSnippet } from '../../../../models/User';

const LikedBy = ({tweet_id}:{tweet_id:string}) => {
  const fetchTweetFeed = async ({ pageParam = -15 }) => {
    //console.log(pageParam)
    const likesPerPage : number = 15
    const response = await fetch(
      `/api/tweet/${tweet_id}?get=like&startingAt=${pageParam}&inTotal=${likesPerPage}`
    );
    const {length , by:results}  = await response.json();
    console.log("liked by", results,-1*pageParam)
    return { results, nextPage: pageParam - likesPerPage,tillNow:-1*pageParam, likesPerPage,length};
  };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [tweet_id,"liked_by"], 
    queryFn:fetchTweetFeed, 
    staleTime:1000*60*1,
    // keepPreviousData: true,
    getNextPageParam: (lastPage, pages) => {
      //console.log(lastPage.results.length , lastPage.nextPage)
      if (lastPage.tillNow < lastPage.length) return lastPage.nextPage;
      return undefined;
    }
  });
  return (
    <div className=' h-96 p-4 overflow-y-scroll' style={{width:"750px"}}>
      {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>There was an error</p>
        ) : (
          //@ts-ignore
          <div> <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
            { 
              data && data?.pages.map((page,usersPageNum:number)=>
                page.results.map((user_details : IUserSnippet,usersIndex:number )=>
                  <div key={user_details._id} className="flex items-center space-x-4 py-5 justify-between">
                    {/**@ts-ignore */}
                    
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src={user_details?.avatar as string} alt="Neil image"/>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {user_details.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {user_details.user_name}
                    </p>
                  </div>
                )
              )
            }
            </InfiniteScroll>
          </div>
        )}
    </div>
  )
}
export const curryLikedBy = ({tweet_id}:{tweet_id:string}) => LikedBy({tweet_id})

export default LikedBy