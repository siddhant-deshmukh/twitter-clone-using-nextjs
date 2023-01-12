import React, { useCallback, useState } from "react";
import { ITweetEditorProps } from "../../types";
import { useSession } from "next-auth/react";
import { ITweet, ITweetContent } from "../../models/Tweet";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChartBarSvg, ChatBubbleSvg, DoubeArrowSvg, HeartSvg } from "../icons";
import { UpdateTweet } from "./TweetPage";

//@ts-ignore
const TweetCard = ({TweetData,tweetIndex,queryClient,tweetPageNum}:{TweetData:ITweet | null,tweetIndex:number,tweetPageNum:number}) => {
    const { data: session,status} = useSession()
    const router = useRouter()
    const btnTypes = ["view","comment","retweet","like"]
    const updateTweet = useCallback((type:"liked" | "retweet" | "")=>{
      if(type!== "liked" && type!=="retweet") return
      if(TweetData && status === "authenticated" && tweetIndex && tweetPageNum){
        UpdateTweet(TweetData._id as string,type,queryClient,tweetIndex,tweetPageNum)
      }
    },[TweetData,status])
    //console.log(TweetData)
    return (
        <>
        { TweetData &&
        <Link href={`/tweet/${TweetData._id}?tweetIndex=${tweetIndex}&tweetPageNum=${tweetPageNum}`} className="hover:cursor-pointer" >
            <div className="py-2 px-1 flex border border-gray-200 text-left" style={{ width: 500 }}>

                <Link href={`/home`}>
                    <div  className="w-fit shrink-0 px-2 py-2">
                        <img className="w-8 h-8 rounded-full bg-black hover:opacity-20" src={TweetData.authorDetails?.avatar} alt={TweetData.authorDetails?.name}/>
                    </div>
                </Link>
                <div className="w-full">
                    <div className="flex space-x-1 min-w-0 items-center">
                        <Link href={`/home`}>
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
                        {/* {
                            btnTypes.map((btn_type : string )=><div key={`${btn_type}`}>
                                <TweetButtons TweetData={TweetData} updateTweet={updateTweet} btnType={btn_type} />
                                </div>)
                        } */}
                        <div className="flex items-center space-x-20 text-sm">
                            <button className={`group flex space-x-0.5 text-gray-500 hover:text-blue-400 items-center`}>
                                <div className="group-hover:bg-blue-100 p-1.5 w-fit h-fit rounded-full">
                                    <ChartBarSvg hoverColor="" fillColor="none" />
                                </div>
                                <div>
                                    {TweetData.num_views}
                                </div>
                            </button>
                            <button className="group flex space-x-0.5 text-gray-500 hover:text-blue-400 items-center">
                                <div className="group-hover:bg-blue-100 p-1.5 w-fit h-fit rounded-full">
                                    <ChatBubbleSvg hoverColor="text-blue-400" fillColor="white" />
                                </div>
                                <div>
                                    {TweetData.num_comments}
                                </div>
                            </button>
                            <button 
                                onClick={(event)=>{event.preventDefault(); updateTweet("retweet")}}
                                className={`group flex space-x-0.5 ${(TweetData.has_retweet)?"text-green-500":"text-gray-500"} hover:text-green-500 items-center`}>
                                <div className="group-hover:bg-green-50 p-1.5 w-fit h-fit rounded-full">
                                    <DoubeArrowSvg hoverColor="" fillColor="none" />
                                </div>
                                <div>
                                    {TweetData.num_retweet}
                                </div>
                            </button>
                            <button 
                                onClick={(event)=>{event.preventDefault(); updateTweet("liked")}}
                                className={`group flex space-x-0.5 ${(TweetData.has_liked)?"text-red-500":"text-gray-500"} hover:text-red-500 items-center`}>
                                <div className="group-hover:bg-red-100 p-1.5 w-fit h-fit rounded-full">
                                    <HeartSvg hoverColor="" fillColor={(TweetData.has_liked)?"red":"none"} />
                                </div>
                                <div>
                                    {TweetData.num_likes}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
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


export function TweetButtons({TweetData,btnType,updateTweet}:{TweetData:ITweet,btnType:string,updateTweet:IUpdateTweet}){
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

    const btnFea : IBtnFeature = BtnTypesAndFeatures[btnType]
    return(
        <button className={`flex group space-x-1  hover:${btnFea.hover_color}  items-center`} 
            onClick={(event)=>{event.preventDefault(); updateTweet(btnFea.update_tweet_param)}}
            >
            <div className="p-1 w-fit h-fit group-hover:bg-red-300 rounded-full ">
                <img  src={btnFea.svg_path} className="w-4 h-4 fill-red-900 " />
            </div>
            <div>
                {TweetData[btnFea.num_count_var]}
            </div> 
        </button>
    )
}
export default TweetCard