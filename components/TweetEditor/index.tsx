import React, { useCallback, useContext, useState } from "react";
import { ITweetEditorProps, ITwitterContext } from "../../types";
import { useSession } from "next-auth/react";
import { IContent,  ITweetContent, ITweetFileAttachments } from "../../models/Tweet";
import AppContext from "../../context/TwitterContext";
import ContentImgs from "./ContentImgs";
import { IMedia } from "../../models/Media";
import Axios from "axios"

const TweetEditor = ({motive,otherTweet}:ITweetEditorProps) => {
    const [tweetText,setTweetText] = useState<string>("Whatsup guys!")
    const [tweetAttachments,setTweetAttachments] = useState<ITweetFileAttachments>({content_type:""})
    const {closeModal,modalData} = useContext(AppContext) as ITwitterContext 

    //@ts-ignore
    const uploadTweet = useCallback(async (event) =>{
      event.preventDefault()
      const tweetContent : ITweetContent  = {
        text:tweetText,
        parent_tweet:null,
        tagged_people:[],
        content:{
          content_type:tweetAttachments.content_type,
        }
      }
      
      if(tweetText.trim() !== "" || tweetAttachments.content_type !== ""){
        //console.log(process.env.NEXT_PUBLIC_URL)
        await UploadTweet(tweetContent,tweetAttachments)
        closeModal({goBack:true})
      }
    },[tweetText,tweetAttachments])
    const { data: session } = useSession()

    const handleSelectingMediaBtn = useCallback((e : React.ChangeEvent<HTMLInputElement>) => {
        // console.log(e?.target?.files)
        if(!e || !e.target || !e.target.files || !e.target.files.length){
          console.error("Error in event of handleSelectingMediaBtn")
          return
        }
        let mediaFiles : IMedia[] = [];
        for(let i=0;i<e?.target?.files?.length;i++){
          let file = e?.target?.files[i]
          let url =  URL.createObjectURL(file)
          //@ts-ignore
          mediaFiles.push({size:file.size, type:file.type ,url,file})
        }
        //console.log(mediaFiles)
        
        let new_tweetAttachments : ITweetFileAttachments = {content_type:"media",media:mediaFiles}
        if(tweetAttachments.media){
          new_tweetAttachments.media = tweetAttachments.media?.concat(mediaFiles)
        }
        setTweetAttachments(new_tweetAttachments)
        // setTweetContent(prev=>{
        //   return {
        //     ...prev,
        //     content_type:"media"
        //   }
        // })
        console.log(new_tweetAttachments)
    },[tweetAttachments,setTweetAttachments]) 

    

    return (
      <div className="flex " style={{ width: 500 }}>
        { session?.user.image &&
          <div className="w-fit shrink-0 px-2 py-2 ">
            <img className="w-10 h-10 rounded-full" src={session?.user?.image} alt="Rounded avatar"/>
          </div>
        }
        <div className="w-full px-1">
          <div className="h-8 pt-2">
            <button className="flex items-center px-2 border-blue-100 border-2 font-semibold text-blue-400 rounded-full " >
              <div className="" style={{"fontSize":"11px"}} >
                Everyone 
              </div>
              <svg viewBox="0 0 24 24" className="pl-1 fill-blue-400 w-4 h-4 text-blue-400">
                <path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"></path>
              </svg>
            </button>
          </div>
          <div 
             contentEditable suppressContentEditableWarning={true} 
             className="py-4 break-all  border-none break-normal outline-none  overflow-ellipsis"
             onInput={e => setTweetText(e.currentTarget.textContent as string)}
             placeholder="Enter your text here"
            >
            
          </div>
          {
            tweetAttachments.content_type === "media" && 
            <ContentImgs tweetAttachments={tweetAttachments} setTweetAttachments={setTweetAttachments} />
          }
          <div className="flex border-t justify-between w-full border-blue-100 pt-2" style={{fontSize:"15px"}}>
            <div className="flex items-center">

              <div>
                <input type="file" id="select-media" onChange={handleSelectingMediaBtn} accept=".png, .jpg, .gif, .jpeg" hidden/>
                <label className="place-content-center" htmlFor={"select-media"} >
                  <div className="w-fit p-1.5 hover:bg-blue-50 rounded-full hover:cursor-pointer">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-blue-500">
                      <g>
                        <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                      </g>
                    </svg>
                  </div>
                </label>
              </div>
              <button className="place-content-center">
                <div className="w-fit p-1.5 hover:bg-blue-50 rounded-full">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-blue-500">
                    <g>
                    <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"></path>
                    </g>
                  </svg>
                </div>
              </button>
              <button className="place-content-center">
                <div className="w-fit p-1.5 hover:bg-blue-50 rounded-full">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-blue-500">
                    <g>
                    <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zm10.25-4.001c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z"></path>
                    </g>
                  </svg>
                </div>
              </button>
              <button className="place-content-center">
                <div className="w-fit p-1.5 hover:bg-blue-50 rounded-full">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-blue-500">
                    <g>
                    <path d="M6 5c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zM2 7c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12V6h10v2zM6 15c-1.1 0-2 .895-2 2s.9 2 2 2 2-.895 2-2-.9-2-2-2zm-4 2c0-2.209 1.79-4 4-4s4 1.791 4 4-1.79 4-4 4-4-1.791-4-4zm20 1H12v-2h10v2zM7 7c0 .552-.45 1-1 1s-1-.448-1-1 .45-1 1-1 1 .448 1 1z"></path>
                    </g>
                  </svg>
                </div>
              </button>
              <button className="place-content-center">
                <div className="w-fit p-1.5 hover:bg-blue-50 rounded-full">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-blue-500">
                    <g>
                      <path d="M6 3V2h2v1h6V2h2v1h1.5C18.88 3 20 4.119 20 5.5v2h-2v-2c0-.276-.22-.5-.5-.5H16v1h-2V5H8v1H6V5H4.5c-.28 0-.5.224-.5.5v12c0 .276.22.5.5.5h3v2h-3C3.12 20 2 18.881 2 17.5v-12C2 4.119 3.12 3 4.5 3H6zm9.5 8c-2.49 0-4.5 2.015-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.01-4.5-4.5-4.5zM9 15.5C9 11.91 11.91 9 15.5 9s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5S9 19.09 9 15.5zm5.5-2.5h2v2.086l1.71 1.707-1.42 1.414-2.29-2.293V13z"></path>
                    </g>
                  </svg>
                </div>
              </button>
              <button className="place-content-center">
                <div className="w-fit p-1.5 hover:bg-blue-50 rounded-full">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-blue-500">
                    <g>
                    <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                    </g>
                  </svg>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 p-0.5 fill-blue-300 border border-blue-300 rounded-full">
                  <g>
                    <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z">
                    </path>
                  </g>
                </svg>
              </button>
              <button 
                className="rounded-full text-white bg-blue-400 px-2.5 text-sm py-1.5 text-center" 
                onClick={uploadTweet}
                >
                Tweet 
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

async function UploadTweet(tweetContent:ITweetContent,tweetAttachments:ITweetFileAttachments) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tweet`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    //@ts-ignore
    body:JSON.stringify({tweetContent,tweetAttachments})
  }).then((res)=> res.json())
  //const res = await authenticator()
  const {UrlsFields} = res
  console.log()
  console.log("UrlsFields",UrlsFields)
  console.log()

  UrlsFields.forEach(async ({ url, fields }:{url:string,fields:any},index:number) => {
    //@ts-ignore
    let file = tweetAttachments?.media[index].file
    let formData = new FormData()

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string)
      //console.log(formData ,key, value )
    })
    console.log(index,formData.get('acl'))
    const upload = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':file.type,
        'x-amz-acl': 'public-read'
      },
      mode:'no-cors',
      body: formData,
    }).catch(err=>console.log("Error to upload",err))
    //@ts-ignore
    if (upload.ok) {
      console.log('Uploaded successfully!',upload,url,fields)
    }else{
      console.log("error")
    }
    
  });
  console.log("response",res)
}

export const curryTweetEditor = ({motive,otherTweet}:ITweetEditorProps) =>{
  return TweetEditor({motive,otherTweet})
}
export default TweetEditor