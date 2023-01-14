import React, { useCallback, useState } from "react";
import { ITweetEditorProps } from "../../types";
import { useSession } from "next-auth/react";
import { ITweet, ITweetContent } from "../../models/Tweet";
import { useQueryClient } from "react-query";
import type { QueryClient } from "react-query";
import { DoubeArrowSvg, HeartSvg } from "../icons";
import Link from "next/link";

const TweetPage = ({TweetData,queryClient,tweetIndex,tweetPageNum}:{TweetData:ITweet | null,queryClient:QueryClient, tweetIndex?:string,tweetPageNum?:string}) => {
    // const [,setTweetText] = useState<string>("Whatsup guys!")
    
    //@ts-ignore
    // const uploadTweet = useCallback(async (event) =>{
    //   event.preventDefault()
    //   const tweetContent : ITweetContent  = {
    //     text:tweetText,
    //     parent_tweet:null,
    //     tagged_people:[]
    //   }
    //   if(tweetText.trim() != ""){
    //     console.log(process.env.NEXT_PUBLIC_URL)
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet`,{
    //       method:'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       //@ts-ignore
    //       body:JSON.stringify(tweetContent)
    //     }).then((res)=> res.json())
    //     //const res = await authenticator()
    //     console.log("response",res)
    //   }
    // },[tweetText])
    const { data: session } = useSession()
    const updateTweet = useCallback((type:"liked" | "retweet")=>{
      console.log(type)
      if(TweetData && tweetIndex && tweetPageNum && session){
        UpdateTweet(TweetData._id as string,type,queryClient,parseInt(tweetIndex as string),parseInt(tweetPageNum as string))
      }
    },[TweetData,session])
    return (
        <>
        { TweetData &&
        <div className="" style={{ width: 500 }}>

            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={TweetData.authorDetails?.avatar} alt={TweetData?.authorDetails?.name}/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {TweetData?.authorDetails?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {TweetData?.authorDetails?.user_name}
                    </p>
                </div>
            </div>
            <p>
                {TweetData?.text}
            </p>
            <div className="flex justify-between py-1 mb-3 px-1">
                <Link href={""} >
                    {TweetData.num_comments} Comment
                </Link>
                <Link href={`/tweet/${TweetData._id?.toString()}/?modal=liked_by`} >
                    {TweetData.num_likes} Like
                </Link>
                <Link href={`/tweet/${TweetData._id?.toString()}/?modal=retweeted_by`} >
                    {TweetData.num_retweet} Retweet
                </Link>
            </div>
            <div className="flex justify-between py-1 px-1 items-center border border-blue-300">
                <button className="w-full" onClick={(event)=>{event.preventDefault(); updateTweet("liked")}}>
                    <div className="group-hover:bg-red-100 p-1.5 w-fit mx-auto h-fit rounded-full">
                        <HeartSvg hoverColor="" fillColor={(TweetData.has_liked)?"red":"none"} />
                    </div>
                </button>
                <button className={`w-full ${(TweetData.has_retweet)?"text-green-500":"text-gray-500"}`} onClick={(event)=>{event.preventDefault(); updateTweet("retweet")}}>
                    <div className="group-hover:bg-green-50 p-1.5 w-fit mx-auto h-fit rounded-full">
                        <DoubeArrowSvg hoverColor="" fillColor="none" />
                    </div>
                </button>
            </div>
        </div>
        }
        </>
    );
}

//@ts-ignore
export async function UpdateTweet(_id:string,type:"liked" | "retweet",queryClient,tweetIndex:number,tweetPageNum:number){
    console.log("Updating the tweet")
    if(queryClient){
        //@ts-ignore
        queryClient.setQueryData(['TweetFeed'],(oldData)=>{
            const cachedTweet = oldData?.pages[tweetPageNum].results[tweetIndex]
            // console.log(oldData)
            console.log(typeof tweetPageNum)
            const currentPage = oldData?.pages[tweetPageNum]
            // console.log(tweetPageNum,currentPage)
            const cachedTweet_ = currentPage.results[tweetIndex]
            // console.log(cachedTweet_)   
            if(type==="liked"){
                if(!cachedTweet.has_liked){
                    cachedTweet.num_likes += 1
                    cachedTweet.has_liked = true
                }else{
                    cachedTweet.num_likes -= 1
                    cachedTweet.has_liked = false
                }
            }else{
                if(!cachedTweet.has_retweet){
                    cachedTweet.num_retweet += 1
                    cachedTweet.has_retweet = true
                }else{
                    cachedTweet.num_retweet -= 1
                    cachedTweet.has_retweet = false
                }
            }
            return oldData
        })
    }
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet/${_id}`,{
        method:'PUT',
        body : JSON.stringify({task_type:type})
    }).then(res=>res.json())
      .then(data=>{
          console.log("UpdateTweet",type, data)
      })
}

export default TweetPage