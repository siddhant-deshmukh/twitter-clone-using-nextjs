import { AuthContext } from "@/context/authContext";
import useUserCache from "@/hooks/useUserCache";
import { IMedia } from "@/models/Media";
import { ITweet } from "@/models/Tweet";
import { useCallback, useContext, useRef, useState } from "react";
import { KeyedMutator, State, useSWRConfig } from "swr";
import { AuthorAvatar } from "./FeedTweetComponent";


export function FeedTweetEditor({ mutateOwnTweets }: {
  mutateOwnTweets?: KeyedMutator<State<any, any> | undefined>
}) {
  const { authState } = useContext(AuthContext)
  const [text, setText] = useState<string>('')
  const { refreshInterval, cache, mutate } = useSWRConfig()
  const [mediaFiles, setMediaFiles] = useState<IMedia[]>([])
  const newTweetEditor = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>('')

  const handleMediaSubmitBtn = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e?.target?.files)
    if (!e || !e.target || !e.target.files || !e.target.files.length) {
      console.error("Error in event of handleSelectingMediaBtn")
      return
    }
    let media_: IMedia[] = []
    for (let i = 0; i < e?.target?.files?.length; i++) {
      let file = e?.target?.files[i]
      // console.log(i,file)
      let url = URL.createObjectURL(file)
      //@ts-ignore
      media_.push({ size: file.size, type: file.type, url, key: i.toString(), file })
    }

    setMediaFiles((prev) => {
      let new_ = prev.slice().concat(media_)
      return new_
    })



  }, [])

  return (
    <div>
      {
        error && error.length > 0 &&
        <div className="flex justify-between items-center py-0.5 px-3 w-full text-red-800  bg-red-50">
          <div>
            {error}
          </div>
          <button
            className="py-2 px-3 hover:bg-red-100 rounded-full"
            onClick={(event) => {
              event.preventDefault()
              setError('')
            }}
          >
            X
          </button>
        </div>
      }
      <div className="flex w-full  space-x-2 px-2 pt-5 border border-gray-200 ">
        {
          authState?._id && <AuthorAvatar author_id={authState._id.toString()} />
        }

        {/* text editor */}
        <div className="w-full relative mt-2 mr-3 flex flex-col h-full justify-between">
          <div>
            {/* {
          text
        } */}
            {<div
              id="tweet-editor-feed"
              contentEditable='true'
              ref={newTweetEditor}
              className=" w-full relative outline-none text-xl inline-block "
              onInput={(event) => {
                //@ts-ignore
                setText(event.currentTarget.innerHTML);
              }}
            >

            </div>}
            {
              (text.length <= 0) && <div

                className="absolute top-0 left-0 -z-10  h-fit w-fit text-gray-500  outline-none text-xl"
              >
                What is happening?
              </div>
            }
            {
              mediaFiles && mediaFiles.length > 0 &&
              <div className={` my-2
              ${(mediaFiles.length > 1) ? 'grid gap-3 grid-cols-2 h-96' : ''} 
              ${(mediaFiles.length > 2) ? 'grid-rows-2' : ''} `}>
                {
                  mediaFiles.map((ele, index) => {
                    return <div className={`w-full h-full rounded-xl overflow-hidden relative ${(mediaFiles.length === 3 && index === 0) ? 'row-span-2' : ''} `} key={ele.url}>
                      <button
                        className="absolute bg-black opacity-70 text-white rounded-full text-sm py-2 px-3 left-2 top-2"
                        onClick={(event) => {
                          event.preventDefault();
                          setMediaFiles((prev) => {
                            return prev.slice(0, index).concat(prev.slice(index + 1))
                          })
                        }}
                      >X</button>
                      <img alt="image" src={ele.url || ""} className="w-full h-full max-h-[600px]" />
                    </div>
                  })
                }
              </div>
            }
          </div>
          {/* Foot buttons */}
          <div className="flex w-full items-center justify-between border-y border-y-gray-100 py-3 mt-5">
            <ul className="flex items-center">
              <label form="input-file-TweetFeed group" className="relative">
                <button
                  className="w-9 p-2 h-9 rounded-full hover:bg-blue-50 "
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                    <path strokeWidth={1.0} d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                  </svg>
                </button>
                <input
                  multiple id="input-file-TweetFeed" type='file' accept=".jpg, .png, .jpng, .gif" className="absolute text-[0px] hover:cursor-pointer top-0 left-0 w-full h-full overflow-hidden opacity-0 z-10"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    event.preventDefault();
                    handleMediaSubmitBtn(event)
                  }
                  } />
              </label>

              <button
                className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
                onClick={(event) => {
                  event.preventDefault()
                }
                }>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                  <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                </svg>
              </button>
              <button
                className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
                onClick={(event) => {
                  event.preventDefault()
                }
                }>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                  <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path>
                </svg>
              </button>
              <button
                className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
                onClick={(event) => {
                  event.preventDefault()
                }
                }>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                  <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                </svg>
              </button>
              <button
                className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
                onClick={(event) => {
                  event.preventDefault()
                }
                }>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                  <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path>
                </svg>
              </button>
              <button
                className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
                onClick={(event) => {
                  event.preventDefault()
                }
                }>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                  <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                </svg>
              </button>
            </ul>
            {/* Submit tweet button */}
            <button
              className="px-4 py-1.5 rounded-full bg-blue-400 text-white"
              onClick={(event) => {
                event.preventDefault();
                if (!authState) return;
                const prev = cache.get('own/tweetfeed')
                let text_ = text.replaceAll('<br>', '\n').replaceAll('&nbsp', '')
                let new_tweet: ITweet = {
                  _id: 'new_' + Math.floor(Math.random() * 100000).toString(),
                  parent_tweet: null,
                  num_comments: 0,
                  num_likes: 0,
                  num_quotes: 0,
                  num_retweet: 0,
                  num_views: 0,
                  author: authState?._id.toString(),
                  text: text_,
                  media: mediaFiles,
                  //@ts-ignore
                  time: Date.now(),
                  have_liked: false,
                  have_retweeted: false,
                }
                let new_ = []
                if (prev && Array.isArray(prev)) {
                  new_ = [new_tweet._id].concat(prev)
                } else {
                  new_ = [new_tweet._id]
                }

                // UploadTweet(text_, mediaFiles).then((new_) => {
                //   console.log("New tweet response", new_)
                //   if (new_ && new_._id) {
                //     //@ts-ignore
                //     cache.set('own/tweetfeed', new_)
                //     //@ts-ignore
                //     cache.set(`tweet/${new_tweet._id}`, new_tweet)
                //     // console.log('!!!!!!!',new_tweet,cache.get(`tweet/${new_tweet._id}`),cache.get('own/tweetfeed'))
                //     //@ts-ignore
                //     if (mutateOwnTweets) mutateOwnTweets(new_)
                //     setMediaFiles([])
                //     setText('')
                //     // let editor = document.getDocumentB('tweet-editor-feed')
                //     if (newTweetEditor.current?.innerText) {
                //       //@ts-ignore
                //       newTweetEditor.current.textContent = ''
                //     }
                //   } else {
                //     console.log("Error while uploading tweet")
                //     setError('some error')
                //   }
                // }).catch((err) => {
                //   console.log("Error while uploading tweet", err)
                //   setError(err)
                // })

              }}>
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// export function CommentFeedCommentEditor({ user_id, parent_tweet_id }: { user_id?: string, parent_tweet_id: string }) {
//   const { authState } = useContext(AuthContext)
//   const [text, setText] = useState<string>('')
//   const { refreshInterval, cache, mutate } = useSWRConfig()
//   const [mediaFiles, setMediaFiles] = useState<IMedia[]>([])
//   const { authorDetails: userDetails } = useUserCache(user_id)

//   const handleMediaSubmitBtn = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     // console.log(e?.target?.files)
//     if (!e || !e.target || !e.target.files || !e.target.files.length) {
//       console.error("Error in event of handleSelectingMediaBtn")
//       return
//     }
//     let media_: IMedia[] = []
//     for (let i = 0; i < e?.target?.files?.length; i++) {
//       let file = e?.target?.files[i]
//       // console.log(i,file)
//       let url = URL.createObjectURL(file)
//       //@ts-ignore
//       media_.push({ size: file.size, type: file.type, url, key: i.toString() })
//     }

//     setMediaFiles((prev) => {
//       let new_ = prev.slice().concat(media_)
//       return new_
//     })



//   }, [])

//   return (
//     <div
//       className="flex w-full relative space-x-1.5 px-1 py-5  border border-gray-50 "
//     >
//       <span className="top-0 left-[78px] absolute z-10 text-gray-600 text-sm">
//         Replying to <span className="text-blue-400">@{userDetails?.user_name || 'Someone'}</span>
//       </span>
//       {
//         authState?._id && <AuthorAvatar author_id={authState._id.toString()} />
//       }
//       <div className="w-full  mt-2 mr-3 ">

//         <div className="relative">
//           {
//             <div
//               id="tweet-editor-feed"
//               contentEditable='true'
//               className="h-fit w-full relative outline-none text-lg"
//               onInput={(event) => {
//                 //@ts-ignore
//                 setText(event.currentTarget.textContent);
//               }}
//             >

//             </div>
//           }
//           {
//             (text.length <= 0) && <div

//               className="absolute top-0 left-0 -z-10  h-fit w-fit text-gray-500  outline-none text-lg"
//             >
//               Tweet your reply
//             </div>
//           }

//         </div>
//         {
//           mediaFiles && mediaFiles.length > 0 &&
//           <div className={` my-2
//               ${(mediaFiles.length > 1) ? 'grid gap-3 grid-cols-2 h-96' : ''} 
//               ${(mediaFiles.length > 2) ? 'grid-rows-2' : ''} `}>
//             {
//               mediaFiles.map((ele, index) => {
//                 return <div className={`w-full h-full rounded-xl overflow-hidden relative ${(mediaFiles.length === 3 && index === 0) ? 'row-span-2' : ''} `} key={ele.url}>
//                   <button
//                     className="absolute bg-black opacity-70 text-white rounded-full text-sm py-2 px-3 left-2 top-2"
//                     onClick={(event) => {
//                       event.preventDefault();
//                       setMediaFiles((prev) => {
//                         return prev.slice(0, index).concat(prev.slice(index + 1))
//                       })
//                     }}
//                   >X</button>
//                   <img alt="image" src={ele.url || ""} className="w-full h-full max-h-[600px]" />
//                 </div>
//               })
//             }
//           </div>
//         }
//         <div className="flex w-full items-center justify-between border-y border-y-gray-100 py-2 mt-3">
//           <ul className="flex items-center">
//             <label form="input-file-TweetFeed group" className="relative">
//               <button
//                 className="w-9 p-2 h-9 rounded-full hover:bg-blue-50 "
//               >
//                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
//                   <path strokeWidth={1.0} d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
//                 </svg>
//               </button>
//               <input
//                 multiple id="input-file-TweetFeed" type='file' accept=".jpg, .png, .jpng, .gif" className="absolute text-[0px] hover:cursor-pointer top-0 left-0 w-full h-full overflow-hidden opacity-0 z-10"
//                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//                   event.preventDefault();
//                   handleMediaSubmitBtn(event)
//                 }
//                 } />
//             </label>

//             <button
//               className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
//               onClick={(event) => {
//                 event.preventDefault()
//               }
//               }>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
//                 <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
//               </svg>
//             </button>
//             {/* GIf */}
//             {/* <button
//               className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
//               onClick={(event) => {
//                 event.preventDefault()
//               }
//               }>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
//                 <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path>
//               </svg>
//             </button> */}
//             {/* poll */}
//             <button
//               className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
//               onClick={(event) => {
//                 event.preventDefault()
//               }
//               }>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
//                 <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
//               </svg>
//             </button>
//             {/* emoji */}
//             {/* <button
//               className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
//               onClick={(event) => {
//                 event.preventDefault()
//               }
//               }>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
//                 <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path>
//               </svg>
//             </button> */}
//             {/* calender */}
//             <button
//               className="w-9 p-2 h-9 rounded-full hover:bg-blue-50"
//               onClick={(event) => {
//                 event.preventDefault()
//               }
//               }>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
//                 <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
//               </svg>
//             </button>
//             { /* Map */}
//           </ul>
//           {/* Submit tweet button */}
//           <button
//             className="px-4 py-1.5 rounded-full bg-blue-400 text-white"
//             onClick={(event) => {
//               // event.preventDefault();
//               // if (!authState) return;
//               // const prev = cache.get(`/own_comment/${parent_tweet_id}`) || []
//               // console.log('prev comment',`/own_comment/${parent_tweet_id}` , prev)
//               // let new_tweet: ITweet = {
//               //   _id: 'new_' + Math.floor(Math.random() * 100000).toString(),
//               //   parent_tweet: parent_tweet_id,
//               //   num_comments: 0,
//               //   num_likes: 0,
//               //   num_quotes: 0,
//               //   num_retweet: 0,
//               //   num_views: 0,
//               //   author: authState?._id.toString(),
//               //   text,
//               //   media: mediaFiles,
//               //   //@ts-ignore
//               //   time: Date.now(),
//               //   have_liked: false,
//               //   have_retweeted: false,
//               // }
//               // if (prev && Array.isArray(prev)) {
//               //   let new_ = [new_tweet._id].concat(prev)
//               //   console.log('new comment',`/own_comment/${parent_tweet_id}`,new_)
//               //   //@ts-ignore
//               //   cache.set(`/own_comment/${parent_tweet_id}`, new_)
//               // } else {
//               //   //@ts-ignore
//               //   cache.set(`/own_comment/${parent_tweet_id}`, [new_tweet._id])
//               // }
//               // //@ts-ignore
//               // cache.set(`tweet/${new_tweet._id}`, new_tweet)
//               // // console.log('!!!!!!!',new_tweet,cache.get(`tweet/${new_tweet._id}`),cache.get('own/tweetfeed'))



//               event.preventDefault();
//               if (!authState) return;
//               if (!parent_tweet_id || typeof parent_tweet_id !== 'string') return;
//               const prev = cache.get(`own_comment/${parent_tweet_id}`)
//               let new_tweet: ITweet = {
//                 _id: 'new_' + Math.floor(Math.random() * 100000).toString(),
//                 parent_tweet: parent_tweet_id,
//                 num_comments: 0,
//                 num_likes: 0,
//                 num_quotes: 0,
//                 num_retweet: 0,
//                 num_views: 0,
//                 author: authState?._id.toString(),
//                 text,
//                 media: mediaFiles,
//                 //@ts-ignore
//                 time: Date.now(),
//                 have_liked: false,
//                 have_retweeted: false,
//               }
//               if (prev && Array.isArray(prev)) {
//                 let new_ = [new_tweet._id].concat(prev)
//                 //@ts-ignore
//                 cache.set(`own_comment/${parent_tweet_id}`, new_)
//               } else {
//                 //@ts-ignore
//                 cache.set(`own_comment/${parent_tweet_id}`, [new_tweet._id])
//               }
//               //@ts-ignore
//               cache.set(`tweet/${new_tweet._id}`, new_tweet)
//               // console.log('!!!!!!!',new_tweet,cache.get(`tweet/${new_tweet._id}`),cache.get('own/tweetfeed'))
//             }}>
//             Tweet
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// async function UploadTweet(
//   text: string,
//   mediaFiles: IMedia[],
//   parent_tweet_id?: string
// ) {
//   const res = await fetch(`/api/tweet`, {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     credentials: 'include',

//     body: JSON.stringify({
//       text,
//       parent_tweet: parent_tweet_id,
//       mediaFiles,
//     })
//   })
//   const data = await res.json()
//   console.log('data reviced', data)
//   if (data.media_ids && Array.isArray(data.media_ids)) {
//     const uploaded = data.media_ids.map(async (media_id: string, index: number) => {
//       // const blobServiceClient = new BlobServiceClient(blobSasUrl);
//       let file = mediaFiles[index].file
//       if (!file) return;
//       // let blob = new Blob([file], { type: file.type })
//       const blob_data = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_IMG_URL}?media_id=${media_id}`, {
//         method: 'POST',
//         body: file,
//         headers: {
//           "Content-type": file.type
//         }
//       }).then((res) => res.json())
//       console.log('blob data', index, blob_data)
//     })
//     await Promise.all(uploaded)
//   }
//   return data
// }