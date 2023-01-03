import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import Script from 'next/script'


export default function TestPage(){
    const { data: session } = useSession()
    const [jsonText,setJsonText] = useState<string>("")
    const [fT,setFT] = useState<boolean>(true)
    const ref =  useRef(null)
    // useEffect(()=>{
    //     if(fT){
    //         const container = ref.current
    //         setFT(false)
    //         const editor = new JSONEditor(container,{})
    //         const initialJson = {
    //             "Array": [1, 2, 3],
    //             "Boolean": true,
    //             "Null": null,
    //             "Number": 123,
    //             "Object": {"a": "b", "c": "d"},
    //             "String": "Hello World"
    //         }
    //         editor.set(initialJson)

    //         // get json
    //         const updatedJson = editor.get()
    //     }
    // },[])
    return <>
        <div>
        Hello world <br/>
        {JSON.stringify(session?.user)}
        <div>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <textarea id="comment" rows={10} className="w-full p-5 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required></textarea>
            </div>
        </div>
        {/* <div ref={ref} style={{"width": "400px", height: "400px"}}></div> */}
        </div>
        </div>
    </>
}