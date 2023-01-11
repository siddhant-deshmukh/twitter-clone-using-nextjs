import { useEffect, useState } from "react";

export default function TestAWSs3(){
    const [file,setFile] = useState<string[]>([]);
    const selectFile = (e) => {
        setFile((prev)=>prev.concat(e.target.files))
    }
    useEffect(()=>{
        // console.log(file)
        fetch(`/api/s3/uploadFile`)
          .then(res=>res.json())
          .then(data=>console.log(data))
    },[])
    return(
        <div>
            <main>
                <input type={"file"} onChange={selectFile} />
            </main>
        </div>
    )
}