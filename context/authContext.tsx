import { IUser } from "@/models/User";
import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext<{ 
    authLoading: boolean
    authState: IUser | null, 
    setAuthState: React.Dispatch<React.SetStateAction<IUser | null>> ,
    setAuthLoading: (value: React.SetStateAction<boolean>) => void
}>({
    authLoading : true,
    authState: null,
    setAuthState: ()=>{},
    setAuthLoading: ()=>{}
})

//@ts-ignore
export const AuthContextProvider = ({ children }) => {
    const [authState, setAuthState] = useState<IUser | null>(null)
    const [authLoading, setAuthLoading] = useState<boolean>(true)
    useEffect(()=>{
        setAuthLoading(true)
        fetch('/api/check')
            .then((res)=>res.json())
            .then((data)=>{
                if(data && data._id){
                    setAuthState(data)
                }
            })
            .finally(()=>{
                setAuthLoading(false)
            })
    },[])

    return (
        <AuthContext.Provider value={{ authState, setAuthState, authLoading, setAuthLoading }}>
            {children}
        </AuthContext.Provider>
    )
}