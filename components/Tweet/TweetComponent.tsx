import useTweetsCache from "@/hooks/useTweetsCache";
import useUserCache from "@/hooks/useUserCache";
import { ITweet } from "@/models/Tweet";
import Image from "next/image";
import Link from "next/link";

export function TweetComponent({ tweet_id, tweet, updateTweet }: {
  tweet_id: string,
  tweet: ITweet | undefined,
  updateTweet: (what: "liked" | "retweeted" | "add-comment") => void
}) {
  if (!tweet) {
    return <div>
    </div>
  }

  return (
    <div
      id={`${tweet._id}`}
      className="flex w-full px-2 py-1 border-r  border-r-gray-200 dark:border-r-gray-800">

      <div className="w-full flex flex-col px-3 pt-3 ">
        <div className="w-full">
          {
            tweet._id &&
            <AuthorDetails author_id={tweet.author} />
          }
        </div>
        <div className="text-base font-normal text-left py-3">
          <div className="whitespace-pre-line">
            {tweet.text}
          </div>
          {
            tweet.media && tweet.media.length > 0 &&
            <div className={` my-2 gap-1
              ${(tweet.media.length > 1) ? 'grid  grid-cols-2 h-96' : ''} 
              ${(tweet.media.length > 2) ? 'grid-rows-2' : ''} `}>
              {
                tweet.media.map((ele, index) => {
                  return <div className={`w-full h-full rounded-xl overflow-hidden relative ${(tweet.media?.length === 3 && index === 0) ? 'row-span-2' : ''} `} key={ele.url}>
                    {/* {
                      ele.url
                    } */}
                    <Image width={1000} height={1000} alt="image" src={ele.url || ""} className="w-full object-cover h-full max-h-[600px]" />
                  </div>
                })
              }
            </div>
          }
          <div className="flex space-x-3 pt-2">
            <div className="flex ">
              <time className="text-gray-500 dark:text-gray-400" dateTime={tweet.time}>5:39 PM · Mar 27, 2023</time>
            </div>
            <div className="flex ">
              <span className="text-black dark:text-white font-semibold">{tweet.num_views}&nbsp;</span>
              <span className="text-gray-500 dark:text-gray-400">Views</span>
            </div>
          </div>
        </div>

        <ul className="w-full flex justify-start space-x-3 py-3  border-t border-t-gray-200 dark:border-t-gray-800 ">
          <button className="flex  h-fit group">
            <span className="text-black dark:text-white font-semibold group-hover:underline">{tweet.num_retweet}&nbsp;</span>
            <span className="text-gray-500 dark:text-gray-400 group-hover:underline w-fit">Retweets</span>
          </button>
          <button className="flex  group">
            <span className="text-black dark:text-white font-semibold group-hover:underline">{tweet.num_likes}&nbsp;</span>
            <span className="text-gray-500 dark:text-gray-400 group-hover:underline w-fit">Likes</span>
          </button>
        </ul>
        <ul className="flex justify-between text-gray-400 border-y border-y-gray-200 dark:border-y-gray-800 ">
          <li className="w-full">
            <button className="w-fit items-center flex mx-auto space-x-1 px-2 py-2   group hover:text-blue-700 tweet-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-400 rounded-full group-hover:text-blue-700  group-hover:bg-blue-100 dark:group-hover:text-blue-200 dark:group-hover:bg-blue-900">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </button>
          </li>
          <li className="w-full">
            <button
              className={`w-fit ${(tweet.have_retweeted) ? 'text-green-500' : ''} items-center flex mx-auto space-x-1 px-2 py-2   group hover:text-green-700 tweet-btn`}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                updateTweet('retweeted')
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={`p-1.5 w-8 h-8 ${(tweet.have_retweeted) ? 'text-green-500' : 'text-gray-400'} rounded-full group-hover:text-green-700 group-hover:bg-green-100 dark:group-hover:text-green-200 dark:group-hover:bg-green-900`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>

            </button>
          </li>
          <li className="w-full">
            <button
              className={`w-fit ${(tweet.have_liked) ? 'text-red-700' : ''} items-center flex mx-auto space-x-1 px-2 py-2  group hover:text-red-700 tweet-btn`}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                updateTweet('liked')
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill={(tweet.have_liked) ? 'rgb(256 68 68)' : 'none'} viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className={`p-1.5 w-8 h-8 ${(tweet.have_liked) ? 'text-red-700' : 'text-gray-400'}  rounded-full group-hover:text-red-700 group-hover:bg-red-100 dark:group-hover:text-red-200 dark:group-hover:bg-red-900`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </li>
          <li className="w-full">
            <button className="w-fit items-center flex mx-auto space-x-1 px-2 py-2   group hover:text-blue-700 tweet-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-400 rounded-full group-hover:text-blue-700 group-hover:bg-blue-100 dark:group-hover:text-blue-200 dark:group-hover:bg-blue-900">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>

            </button>
          </li>
          <li className="w-full">
            <button
              className="w-fit items-center flex mx-auto space-x-1 px-2 py-2   group hover:text-blue-700 tweet-btn"
              onClick={(event) => {
                console.log("Here")

                event.preventDefault();
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-400 rounded-full group-hover:text-blue-700 group-hover:bg-blue-100 dark:group-hover:text-blue-200 dark:group-hover:bg-blue-900">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AuthorDetails({ author_id }: { author_id: string }) {
  const { authorDetails, loading: authorLoading, error: authorError } = useUserCache(author_id)

  if (authorLoading) {
    return (
      <div className="w-fit animate-pulse flex h-fit user-link space-x-2 items-center">
        <div className="rounded-full  bg-gray-800 hover:opacity-70 w-12 h-12 user-link" />
        <div className="flex flex-col space-y-2">
          <div className="user-link w-44 bg-gray-800 h-2.5  text-base font-bold hover:underline"></div>
          <div className="user-link w-32 bg-gray-800 h-2.5 text-sm  text-gray-400"></div>
        </div>
      </div>

    )
  } else {
    return (
      <Link href={`/user/${author_id}`} className="w-fit flex h-fit user-link space-x-2 items-center">
        {
          authorDetails && authorDetails.avatar
          && <Image width={48} height={48} alt="image" className="rounded-full bg-black hover:opacity-70 w-12 h-12 user-link" src={authorDetails.avatar || ""} />
        }
        {
          (!authorDetails || !authorDetails.avatar) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 user-link border border-black rounded-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        }
        <div className="flex flex-col">
          <Link href={`/user/${author_id}`} className="user-link w-fit text-base font-bold hover:underline">{authorDetails?.name}</Link>
          <Link href={`/user/${author_id}`} className="user-link w-fit text-sm  text-gray-400">@{authorDetails?.user_name}</Link>
        </div>

      </Link>
    )
  }
}