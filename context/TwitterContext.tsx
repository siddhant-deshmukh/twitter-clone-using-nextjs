import { useRouter } from "next/router";
import React, { useState } from "react";
import { IModalData, ITwitterContext } from "../types";
import { useContextualRouting } from "next-use-contextual-routing";
import { curryTweetEditor } from "../components/TweetEditor";
import { curryAddUserName} from "../components/desktop/ModalComp/components/AddUserName"
import { curryLikedBy } from "../components/desktop/ModalComp/components/LikedBy";
import { curryRetweetedBy } from "../components/desktop/ModalComp/components/RetweetedBy";
import { curryTwiitEditor } from "../components/TweetEditor/TwiitEditor";
export const AppContext = React.createContext<ITwitterContext | null>(null);

//@ts-ignore
// const checkTypes : any = (curryFunction,parameters)  => {
//   type ParamsType = Parameters<typeof curryFunction>
  
//   const instanceOfParameters = (params : any): params is ParamsType => {
//     return true
//   }
//   if(instanceOfParameters(parameters)) return true;
//   return false
// }

//@ts-ignore
export const AppProvider= ({children}) => {
    const [modalOn,setModalOn] = useState<boolean>(false)
    const [modalData,setModalData] = useState<IModalData>({title:"",url:"/",type:""})
    const router = useRouter()

    const { makeContextualHref,returnHref } = useContextualRouting()
    const openModal = ({title,url,parameters, type}:IModalData) => { 
      var component : IModalData['component'];
      //"" | "tweet" | "login" | "signup" | "add_username" | "add_birthdate" | "liked_by" | "retweeted_by" | "edit_profile"
      switch(type){
        case "tweet" :
          component = curryTwiitEditor
          break
        case "login" :
          break
        case "signup" :
          break
        case "add_username" :
          component = curryAddUserName
          break
        case "add_birthdate" :
          break
        case "liked_by" :
          component = curryLikedBy
          break
        case "retweeted_by" :
          component = curryRetweetedBy
          break
        case "edit_profile" :
          break
        default :
          component = undefined
      }
      setModalData({title,url,component,parameters,type})
      setModalOn(true)
      // router.push('',url,{shallow:true})
      // router.push(
      //   makeContextualHref(parameters),
      //   url,
      //   {
      //     shallow: true,
      //   }
      // );
    }
    const closeModal : ITwitterContext["closeModal"] = ({goBack}) =>{
      setModalOn(false);
      //router.push(returnHref, undefined, { shallow: true });
      if(goBack)router.back();
    }
    return( < AppContext.Provider value={{modalOn,setModalOn,modalData,setModalData,openModal,closeModal}}>
        {children}
      </ AppContext.Provider >
    );
}
export default AppContext;