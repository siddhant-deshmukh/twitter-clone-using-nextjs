import { useEffect } from "react"
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

const ContentImgs = ({tweetAttachments_,settweetAttachments_,fromWhere} : {tweetAttachments_:ITweetFileAttachments,settweetAttachments_:React.Dispatch<React.SetStateAction<ITweetFileAttachments>>,fromWhere?:string})   => {


  useEffect(()=>{
    console.log("Starting Content Imags!!!!!!!!!!")
  },[])
  const handleCloseBtn : handleCloseBtn = (event,index) => {
    event.preventDefault()
    settweetAttachments_((prev)=>{
        console.log(prev)
        prev.media?.splice(index,1)
        console.log(index,"Updated :",prev.media)
        return {...prev}
    })
  }
  return (
   <div id="Content Images">
     {
        tweetAttachments_.media?.length === 1 && 
        <div className="w-full h-fit overflow-hidden" style={{maxHeight:"500px"}}>
            {/* <img src={tweetAttachments_.media[0].url} /> */}
            <ImageCard handleClostBtn={handleCloseBtn} index={0} imgUrl={tweetAttachments_.media[0].url as string}/>
        </div>
     }
     {
        tweetAttachments_.media?.length as number > 1 && 
        <div className="w-full  grid grid-cols-2 grid-rows-2" style={{height:"300px"}}>
            <div className={`${(tweetAttachments_.media?.length as number >3)?"":"row-span-2" } max-h-full`}>
                {/** //@ts-ignore */}
                <ImageCard 
                    handleClostBtn={handleCloseBtn} index={0} 
                    /*
                    // @ts-ignore */
                    imgUrl={tweetAttachments_.media[0].url}
                /> 
                {tweetAttachments_.media?.length as number >3 
                  && 
                  <ImageCard 
                    handleClostBtn={handleCloseBtn} 
                    index={3} 
                    /*
                    // @ts-ignore */
                    imgUrl={tweetAttachments_.media[3].url}
                  />
                }
            </div>
            <div className={`${(tweetAttachments_.media?.length as number > 2)?"":"row-span-2" } max-h-full`}>
                <ImageCard 
                  handleClostBtn={handleCloseBtn} 
                  index={1} 
                  /*
                  // @ts-ignore */
                  imgUrl={tweetAttachments_.media[1].url}/>
                {tweetAttachments_.media?.length as number >2 
                  && <ImageCard 
                    handleClostBtn={handleCloseBtn} 
                    index={2} 
                    /*
                    // @ts-ignore */
                    imgUrl={tweetAttachments_.media[2].url}
                    />
                }
            </div>
        </div>
     }
   </div>
  )
}

export default ContentImgs