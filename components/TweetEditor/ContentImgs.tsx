import { IContent, ITweetFileAttachments } from "../../models/Tweet"

type handleCloseBtn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => void

const ImageCard = ({handleClostBtn,imgUrl,index} : {handleClostBtn:handleCloseBtn,imgUrl:string,index:number} ) => {
    return(
        <div className="w-full h-full relative  ">
            <button className="absolute inset-x-3 top-3 rounded-full w-fit h-fit px-1.5 text-sm text-white bg-black opacity-60" 
                onClick={(event)=>{handleClostBtn(event,index)}}
                >X</button>
            <img src={imgUrl} className="w-full h-full shadow-sm shadow-gray-600 rounded-md" />
        </div>
    )
}

const ContentImgs = ({tweetAttachments,setTweetAttachments} : {tweetAttachments:ITweetFileAttachments,setTweetAttachments:React.Dispatch<React.SetStateAction<ITweetFileAttachments>>})   => {

  const handleCloseBtn : handleCloseBtn = (event,index) => {
    event.preventDefault()
    setTweetAttachments((prev)=>{
        console.log(prev)
        prev.media?.splice(index,1)
        console.log(index,"Updated :",prev.media)
        return {...prev}
    })
  }
  return (
   <>
     {
        tweetAttachments.media?.length === 1 && 
        <div className="w-full h-fit overflow-hidden" style={{maxHeight:"500px"}}>
            {/* <img src={tweetAttachments.media[0].url} /> */}
            <ImageCard handleClostBtn={handleCloseBtn} index={0} imgUrl={tweetAttachments.media[0].url}/>
        </div>
     }
     {
        tweetAttachments.media?.length as number > 1 && 
        <div className="w-full  grid grid-cols-2 grid-rows-2" style={{height:"300px"}}>
            <div className={`${(tweetAttachments.media?.length as number >3)?"":"row-span-2" } max-h-full`}>
                {/** //@ts-ignore */}
                <ImageCard 
                    handleClostBtn={handleCloseBtn} index={0} 
                    /*
                    // @ts-ignore */
                    imgUrl={tweetAttachments.media[0].url}
                /> 
                {tweetAttachments.media?.length as number >3 
                  && 
                  <ImageCard 
                    handleClostBtn={handleCloseBtn} 
                    index={3} 
                    /*
                    // @ts-ignore */
                    imgUrl={tweetAttachments.media[3].url}
                  />
                }
            </div>
            <div className={`${(tweetAttachments.media?.length as number > 2)?"":"row-span-2" } max-h-full`}>
                <ImageCard 
                  handleClostBtn={handleCloseBtn} 
                  index={1} 
                  /*
                  // @ts-ignore */
                  imgUrl={tweetAttachments.media[1].url}/>
                {tweetAttachments.media?.length as number >2 
                  && <ImageCard 
                    handleClostBtn={handleCloseBtn} 
                    index={2} 
                    /*
                    // @ts-ignore */
                    imgUrl={tweetAttachments.media[2].url}
                    />
                }
            </div>
        </div>
     }
   </>
  )
}

export default ContentImgs