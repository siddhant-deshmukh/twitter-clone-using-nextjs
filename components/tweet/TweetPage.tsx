import React, { useCallback, useState } from "react";
import { ITweetEditorProps } from "../../types";
import { useSession } from "next-auth/react";
import { ITweet, ITweetContent } from "../../models/Tweet";

const TweetPage = ({TweetData}:{TweetData:ITweet | null}) => {
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
    const updateTweet = useCallback((type:"liked" | "retweet")=>{
      console.log(type)
      if(TweetData){
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet/${TweetData?._id}`,{
            method:'PUT',
            body : JSON.stringify({task_type:type})
        }).then(res=>res.json())
          .then(data=>{
            console.log(data)
          })
      }
    },[TweetData])
    const { data: session } = useSession()
    return (
        <>
        { TweetData &&
        <div className="" style={{ width: 500 }}>

            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        email@windster.com
                    </p>
                </div>
            </div>
            <p>
                {TweetData?.text}
            </p>
            <div className="flex justify-between py-1 px-1">
                <button onClick={(event)=>{event.preventDefault(); }}>{TweetData.num_comments} Comment</button>
                <button onClick={(event)=>{event.preventDefault(); updateTweet("liked")}}>{TweetData.num_likes} Like</button>
                <button onClick={(event)=>{event.preventDefault(); updateTweet("retweet")}}>{TweetData.num_retweet} Retweet</button>
            </div>
        </div>
        }
        </>
    );
}

export default TweetPage