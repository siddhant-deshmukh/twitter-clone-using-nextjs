import React, { useCallback, useState } from "react";
import { ITweetEditorProps } from "../../types";
import { useSession } from "next-auth/react";
import { ITweet, ITweetContent } from "../../models/Tweet";

const TweetCard = ({TweetData}:{TweetData:ITweet | null}) => {
    const { data: session,status} = useSession()

    const updateTweet = useCallback((type:"liked" | "retweet")=>{
      if(TweetData && status === "authenticated"){
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet/${TweetData?._id}`,{
            method:'PUT',
            body : JSON.stringify({task_type:type})
        }).then(res=>res.json())
          .then(data=>{
            console.log(data)
          })
      }
    },[TweetData,status])
    
    return (
        <>
        { TweetData &&
        <div className="py-52" style={{ width: 500 }}>

            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={TweetData.authorDetails?.avatar} alt={TweetData.authorDetails?.name}/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {TweetData.authorDetails?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        @{TweetData.authorDetails?.user_name}
                    </p>
                </div>
            </div>
            <p className="py-3 px-2">
                {TweetData?.text}
            </p>
            <div className="flex justify-between py-2 px-1">
                <button onClick={(event)=>{event.preventDefault(); }}>{TweetData.num_comments} Comment</button>
                <button onClick={(event)=>{event.preventDefault(); updateTweet("liked")}}>{TweetData.num_likes} Like</button>
                <button onClick={(event)=>{event.preventDefault(); updateTweet("retweet")}}>{TweetData.num_retweet} Retweet</button>
            </div>
        </div>
        }
        </>
    );
}

export default TweetCard