export function HeartSvg({hoverColor,fillColor}:{hoverColor:string,fillColor:string}){
    //to like
    return(
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
        fill={fillColor}
        className={`w-4 h-4 ${(hoverColor)?("group-hover:"+hoverColor):""}  ${(fillColor)?("fill-"+fillColor):"fill-none"}`}
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}
export function DoubeArrowSvg({hoverColor,fillColor}:{hoverColor:string,fillColor:string}){
    //to retweet
    return(
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        fill={fillColor} 
        className={`w-4 h-4 ${(hoverColor)?("group-hover:"+hoverColor):""}  ${(fillColor)?("fill-"+fillColor):"fill-none"}`}
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  )
}

export function ChartBarSvg({hoverColor,fillColor}:{hoverColor:string,fillColor:string}){
    //view icon
    return(
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        fill={fillColor} 
        className={`w-4 h-4 ${(hoverColor)?("group-hover:"+hoverColor):""} text-gray-400  ${(fillColor)?("fill-"+fillColor):"fill-none"}`}
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
export function ChatBubbleSvg({hoverColor,fillColor}:{hoverColor:string,fillColor:string}){
    //comment icon
    return(
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
        fill={fillColor}
        //fill={fillColor}
        className={`w-4 h-4 ${(hoverColor)?("group-hover:"+hoverColor):""}  ${(fillColor)?("fill-"+fillColor):"fill-none"}`}
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  
  )
}