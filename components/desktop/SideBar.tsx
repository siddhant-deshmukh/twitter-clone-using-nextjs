import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import AppContext from '../../context/TwitterContext'
import { ITwitterContext } from '../../types'
import { curryTweetEditor } from '../TweetEditor'

const nav_bar_elements = [
    {href:"/home",text:"Home",svg_path:"/navbar_icons/home.svg"},
    {href:"/explore",text:"Explore",svg_path:"/navbar_icons/explore.svg"},
    {href:"/notifications",text:"Notifications",svg_path:"/navbar_icons/notifications.svg"},
    {href:"/messages",text:"Messages",svg_path:"/navbar_icons/messages.svg"},
    {href:"/bookmarks",text:"Bookmarks",svg_path:"/navbar_icons/bookmarks.svg"},
    {href:"/lists",text:"Lists",svg_path:"/navbar_icons/lists.svg"},
    {href:"/profile",text:"Profile",svg_path:"/navbar_icons/profile.svg"},
    {href:"/more",text:"More",svg_path:"/navbar_icons/more.svg"},
  ]

const SideBar = () => {
  const router = useRouter()
  const {setModalOn,openModal} = useContext(AppContext) as ITwitterContext
  return (
    <nav className='h-full  w-fit px-4' style={{width:"220px"}}>
        <div className="overflow-y-auto py-4  h-full dark:bg-gray-800 fixed inset-y-0">
            <Link href="/" className="flex items-center pl-2.5 mb-3">
                <img src="/twitter.ico" className="mr-3 h-6 w-6" alt="Flowbite Logo" />
            </Link>
            <ul className="mb-5">
              {
                nav_bar_elements.map(ele =>{
                  return(
                    <Link href={ele.href} key={ele.text} className="w-full group">
                      <div className="flex items-center py-2.5 px-1.5 w-fit text-base font-normal text-gray-900 rounded-xl dark:text-white group-hover:bg-gray-100 dark:hover:bg-gray-700">
                        {/* <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg> */}
                        <img src={ele.svg_path} alt={ele.text} className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400  dark:group-hover:text-white" />
                        <span className="ml-3 text-2">{ele.text}</span>
                      </div>
                    </Link>
                  )
                })
              }
            </ul>
            {/* <button className='' onClick={(event)=>{event.preventDefault(); openModal({title:'Add user name',url:'compose/tweet',component:curryTweetEditor,parameters:{motive:"tweet"}})}}>
              Tweet 
            </button> */}
            <Link href='?modal=tweet' as='/component/tweet' shallow>
              <button className='bg-blue-500 py-2.5 text-sm rounded-full w-full font-semibold text-white'>
                Tweet 
              </button>
            </Link>
            <br/>
            {/* <Link href='?modal=add_username' as='/i/flow/login/username' shallow>
              Add Username
            </Link> */}
        </div>
    </nav>
  )
}

export default SideBar