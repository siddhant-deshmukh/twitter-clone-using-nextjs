import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import AppContext from "../../../context/TwitterContext"
import { ITweetFileAttachments } from "../../../models/Tweet"
import { IModalData, ITwitterContext } from "../../../types"
import TweetEditor from "../../TweetEditor"

export default function Modal(){
    // const {modalOn,setModalOn} = useContext(AppContext)
    //${modalOn?"":"hidden"}
    const router = useRouter()
    const {closeModal,modalData} = useContext(AppContext) as ITwitterContext 
    useEffect(()=>{
        console.log("Starting modal!")
        return ()=>console.log("Closing the modal!!!")
    },[])
    const [tweetText,setTweetText] = useState<string>("Hello guys!")
    const [tweetAttachments,setTweetAttachments] = useState<ITweetFileAttachments>({content_type:""})
    //console.log("-------        modal   ------------------")
    return(
        <div id="defaultModal"  className={`absolute flex items-center bg-black bg-opacity-30 top-0 left-0 right-0 z-50 m-auto w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full`}>
        <div className="relative  mx-auto  w-full h-full max-w-2xl md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white w-fit h-fit rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex justify-start items-center px-2 py-1  rounded-t dark:border-gray-600">
                    <button onClick={(event) =>{ event.preventDefault(); closeModal({goBack:true})}} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {modalData.title}
                    </h3>
                </div>
                {/* <!-- Modal body --> */}
                {/* { modalData?.component &&
                     <div className="p-2">   
                     {modalData?.component(modalData.parameters)}
                 </div>
                } */}
                { modalData?.type === "tweet" &&
                     <div className="p-2">   
                     <TweetEditor motive='modal' />
                 </div>
                }
                {/* {
                    JSON.stringify(modalData?.parameters)
                } */}
                {/* <!-- Modal footer --> */}
                {/* <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    
                </div> */}
            </div>
        </div>
    </div>
    )
}