import { AuthContext } from '@/context/authContext'
import useUserCache from '@/hooks/useUserCache'
import { CacheNewTweet } from '@/lib/UIFunctions'
import { IMedia } from '@/models/Media'
import { ITweet } from '@/models/Tweet'
import { IUserSnippet } from '@/models/User'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { AuthorAvatar } from '../Tweet/FeedTweetComponent'


const TweetModal = () => {
  const pathname = usePathname()
  const router = useRouter()

  const closeModal = () => {
    router.push(pathname)
  }
  return (
    <div className='fixed left-0 right-0 z-50 bg-black bg-opacity-50 w-screen h-screen overflow-y-auto py-14  px-2'>
      <div className='w-full max-w-[600px] h-fit bg-white mx-auto rounded-2xl overflow-hidden '>
        <header className='flex items-center justify-between   w-full'>
          <button
            className='w-10 h-10 text-lg hover:bg-gray-200 mt-2 mx-2 rounded-full '
            onClick={(event) => {
              event.preventDefault();
              closeModal()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className='min-h-[200px]  relative flex max-h-full'>
          <MainFeedTweetEditor closeModal={closeModal} />
        </main>
      </div>
    </div>
  )
}
export function MainFeedTweetEditor({ closeModal, parent_tweet_author, parent_tweet_id }: {
  parent_tweet_id?: string,
  parent_tweet_author?: string,
  closeModal?: () => void
}) {
  const { authState } = useContext(AuthContext)
  const [text, setText] = useState<string>('')
  const { refreshInterval, cache, mutate } = useSWRConfig()
  const [mediaFiles, setMediaFiles] = useState<IMedia[]>([])
  const newTweetEditorModal = useRef<HTMLInputElement | null>(null);


  const { authorDetails: userDetails } = useUserCache((parent_tweet_author) ? (parent_tweet_author) : undefined)

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
      media_.push({ size: file.size, type: file.type, url, key: i.toString() })
    }

    setMediaFiles((prev) => {
      let new_ = prev.slice().concat(media_)
      return new_
    })
  }, [])

  return (
    <div
      className="flex w-full relative space-x-2 px-2 pt-5 border border-gray-200 "
    >
      {
        userDetails?.user_name &&
        <span className="top-0 left-[88px] absolute z-10 text-gray-600 text-sm">
          Replying to <span className="text-blue-400">@{userDetails?.user_name || 'Someone'}</span>
        </span>
      }
      {
        authState?._id && <AuthorAvatar author_id={authState._id.toString()} />
      }
      <div className="w-full relative mt-2 mr-3 flex flex-col h-full justify-between">

        <div>
          {<div
            id="tweet-editor-modal"
            contentEditable='true'
            ref={newTweetEditorModal}
            className=" w-full relative z-30 outline-none text-xl inline-block "
            onInput={(event) => {
              //@ts-ignore
              setText(event.currentTarget.innerHTML);
            }}
          >

          </div>}
          {
            (text.length <= 0) && <div

              className="absolute top-0 left-0 z-20  h-fit w-fit text-gray-500  outline-none text-xl"
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
                    <img src={ele.url} className="w-full h-full max-h-[600px]" />
                  </div>
                })
              }
            </div>
          }
        </div>
        <div className="flex w-full items-center justify-between border-y border-y-gray-100 py-3 mt-5">
          <ul className="flex items-center">
            <label form="input-file-TweetModal group" className="relative">
              <button
                className="w-9 p-2 h-9 rounded-full hover:bg-blue-50 "
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400 ">
                  <path strokeWidth={1.0} d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                </svg>
              </button>
              <input
                multiple id="input-file-TweetModal" type='file' accept=".jpg, .png, .jpng, .gif" className="absolute text-[0px] hover:cursor-pointer top-0 left-0 w-full h-full overflow-hidden opacity-0 "
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
              CacheNewTweet(authState, text, mediaFiles, cache, mutate, parent_tweet_id)

              
              if (newTweetEditorModal.current?.innerText) {
                //@ts-ignore
                newTweetEditorModal.current.textContent = ''
              }
              setMediaFiles([])
              setText('')
              // mutate('/own/tweetfeed')

              if (closeModal) {
                closeModal()
              }
            }}>
            Tweet
          </button>
        </div>
      </div>
    </div>
  )
}

export default TweetModal