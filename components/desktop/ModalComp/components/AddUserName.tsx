import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../context/TwitterContext'
import { ITwitterContext } from '../../../../types'

const AddUserName = () => {
  const { closeModal } = useContext(AppContext) as ITwitterContext

  const [userName,setUserName] = useState<string>("")
  const [msg,setMsg] = useState<{msg:string,code:1|2|3} | null>(null)
  useEffect(()=>{
    if(userName && userName!== ""){
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/username?name=${userName}`)
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          
          if(data && data.user && data.user.user_name===userName){
            setMsg({msg:'User Already Exist, try another name',code:2})
          }else if(data && data.msg){
            setMsg({msg:'User name available',code:1})
          }else{
            setMsg({msg:'Internal error occured',code:3})
          }
          
        })
    }
  },[userName,setMsg])
  //@ts-ignore
  const handleClick = async (event) =>{
    event.preventDefault()
    const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/username?name=${userName}`,{
        method:'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_name : userName})
      }).then(res=>res.json())
    if(data && data.new_username){
      closeModal({goBack:true})
    }else if(data && data.msg){
      setMsg({msg:data.msg,code:2})
    }else{
      setMsg({msg:'Internal error occured',code:3})
    }
  }
  return (
    <div>
      <div className="relative z-0 mb-6 w-full group">
          <input type="email" value={userName} onChange={(event)=>{event.preventDefault(); setUserName(event.target.value)}} name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
          <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
          <p className={`mt-2 text-sm ${msg?.code==1?"text-blue-600 dark:text-blue-500":"text-red-600 dark:text-red-500" }`}>
            <span className="font-medium">{msg?.msg}</span> 
          </p>
      </div>
      <button onClick={handleClick}>
        Submit
      </button>
    </div>
  )
}

export const curryAddUserName = () => {
  return AddUserName()
}
export default AddUserName