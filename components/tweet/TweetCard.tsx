import React, { useCallback, useState } from "react";
import { ITweetEditorProps } from "../../types";
import { useSession } from "next-auth/react";
import { ITweet, ITweetContent } from "../../models/Tweet";
import Link from "next/link";
import { useRouter } from "next/router";

const TweetCard = ({TweetData}:{TweetData:ITweet | null}) => {
    const { data: session,status} = useSession()
    const router = useRouter()
    const btnTypes = ["view","comment","retweet","like"]
    const updateTweet = useCallback((type:"liked" | "retweet" | "")=>{
      if(type!== "liked" && type!=="retweet") return
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
    //console.log(TweetData)
    return (
        <>
        { TweetData &&
        <button onClick={(e)=>{router.push(`/tweet/${TweetData._id}`)}}>
            <div className="py-2 px-1 flex border border-gray-200 text-left" style={{ width: 500 }}>

                <Link href={`/tweet/home`}>
                    <div  className="w-fit shrink-0 px-2 py-2">
                        <img className="w-8 h-8 rounded-full bg-black hover:opacity-20" src={TweetData.authorDetails?.avatar} alt={TweetData.authorDetails?.name}/>
                    </div>
                </Link>
                <div className="w-full">
                    <div className="flex space-x-1 min-w-0 items-center">
                        <Link href={`/tweet/home`}>
                            <p className="text-base font-medium hover:underline text-gray-900 truncate dark:text-white">
                                {TweetData.authorDetails?.name}
                            </p>
                        </Link>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            @{TweetData.authorDetails?.user_name}
                        </p>
                    </div>
                    <p className="text-sm" >
                        {TweetData?.text}
                    </p>
                    <div className="flex space-x-16 py-1 text-sm w-full">
                        {
                            btnTypes.map((btn_type : string )=><div>
                                <TweetButtons TweetData={TweetData} updateTweet={updateTweet} btnType={btn_type} />
                                </div>)
                        }
                    </div>
                </div>
            </div>
        </button>
        }
        </>
    );
}

interface IBtnFeature{
    num_count_var: "num_retweet"|"num_likes"|"num_comments"|"num_views",
    hover_color : string,
    fill_color : string,
    update_tweet_param : "retweet"|""|"liked"
    svg_path : string,
}
type IBtnTypes = "view"|"comment"|"retweet"|"like"
type IUpdateTweet = (type: "liked" | "retweet" | "") => void
var BtnTypesAndFeatures : {[key:string] : IBtnFeature} = {
    "retweet" : {
        num_count_var : "num_retweet",
        hover_color : "text-red-500",
        fill_color : "text-red-500",
        update_tweet_param:"retweet",
        svg_path:"/tweet_icons/retweeted.svg"
    },"comment" : {
        num_count_var : "num_comments",
        hover_color : "text-red-500",
        fill_color : "none",
        update_tweet_param:"",
        svg_path:"/tweet_icons/comment.svg"
    },"like" : {
        num_count_var : "num_likes",
        hover_color : "text-red-500",
        fill_color : "text-red-500",
        update_tweet_param:"liked",
        svg_path:"/tweet_icons/liked.svg"
    },"view" : {
        num_count_var : "num_views",
        hover_color : "text-red-500",
        fill_color : "none",
        update_tweet_param:"",
        svg_path:"/tweet_icons/view.svg"
    },
}

export function TweetButtons({TweetData,btnType,updateTweet}:{TweetData:ITweet,btnType:string,updateTweet:IUpdateTweet}){
    const btnFea : IBtnFeature = BtnTypesAndFeatures[btnType]
    return(
        <button className={`flex space-x-1 hover:${btnFea.hover_color} text-gray-600 items-center`} 
            onClick={(event)=>{event.preventDefault(); updateTweet(btnFea.update_tweet_param)}}
            >
            <img src={btnFea.svg_path} className="w-4 h-4 fill-blue-300" />
            <div>
                {TweetData[btnFea.num_count_var]}
            </div> 
        </button>
    )
}
export default TweetCard