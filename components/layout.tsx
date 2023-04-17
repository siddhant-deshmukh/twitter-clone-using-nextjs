import { AuthContext } from "@/context/authContext"
import { IUser } from "@/models/User"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useContext, useState } from "react"
import Login from "./Login"
import { HomeSVG, ExploreSVG, NotificationSVG, MsgsSVG, BookmarksSVG, ProfileSVG, MoreSVG, DangerSVG, TweetIcon } from "./svgElemets"
import { usePathname, useSearchParams } from 'next/navigation';
import TweetModal from "./modals/TweetModal"
import Image from "next/image"
import Loading from "./Loading"

export default function Layout({ children }: { children: ReactNode }) {
  const { authLoading, authState, setAuthState } = useContext(AuthContext)
  const searchParams = useSearchParams()

  const openTweetModal = searchParams.has('tweet-modal')
  const openUsersModal = searchParams.getAll('user-list')
  console.log('search parameters ', searchParams.has('tweet-modal'))
  if (authLoading) {
    return (
      // bg-contain  bg-left-bottom bg-no-repeat
      <div className='flex w-screen h-screen   items-center'
      >
        <img src="3d-twitter.png" className="h-full w-auto" />
        <div className="w-full">
          <Loading size={14} />
        </div>
      </div>
    )
  } else if (!(authState && authState._id)) {
    return (
      <Login />
    )
  } else {
    return (
      <div className="flex relative h-screen w-screen ">
        <div className=" flex h-full w-full   "
        >

          <TopNavBar />
          <main
            className="relative overflow-y-auto w-full sm:mx-0 side-left-padding  pt-8 sm:pt-0"
          >
            <div className="flex w-fit">
              <div className="hidden sm:block sticky  top-0 h-screen w-fit px-2 border-r  border-r-gray-200">
                <SideNavbar authState={authState} />
              </div>
              {/* <Header /> */}
              <div className="w-full  sm2:w-[620px] sm2:min-w-[620px] md:mr-auto mr-0  ">
                <div className="hidden w-full">..........</div>
                {children}
              </div>
              <div className="hidden w-[320px] lg:w-[385px] md:block sticky top-0  h-fit  pl-5">
                <RightSideBar />
              </div>
            </div>
          </main>

          <BottomNavBar />
        </div>
        {
          openTweetModal &&
          < TweetModal />
        }
      </div>
    )
  }
}
function SideNavbar({ authState }: { authState: IUser }) {
  const searchParams = useSearchParams()
  const pathname = usePathname();

  const NavBarElements: {
    href?: string,
    text: string,
    svg_path: ({ strokeWidth, fill }: { strokeWidth: string; fill: "none" | "white"; }) => JSX.Element
  }[] = [
      { href: "/home", text: "Home", svg_path: HomeSVG },
      { href: "/#", text: "Explore", svg_path: ExploreSVG },
      { href: "/#", text: "Notifications", svg_path: NotificationSVG },
      { href: "/#", text: "Messages", svg_path: MsgsSVG },
      { href: "/#", text: "Bookmarks", svg_path: BookmarksSVG },
      { href: "/profile", text: "Profile", svg_path: ProfileSVG },
      { href: "/#", text: "More", svg_path: MoreSVG },
    ]
  const router = useRouter();

  return (
    <header className="ml-auto hidden sm:flex  flex-col px-1.5 xl:px-0.5 pt-2 pb-3   h-full justify-between  sm:w-[68px] xl:w-[272px] ">
      <div className="flex flex-col px-1 xl:px-[18px]">
        <Link href={'/home'} className="p-2 mx-1 hover:bg-blue-50 w-fit rounded-full">
          <TweetIcon fill={'#1D9BF0'} />
        </Link>
        <ul className="my-4 px-1 flex flex-col space-y-4">
          <div>
            {
              searchParams.get('tweet-modal')
            }
          </div>
          <Link href='/home' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <HomeSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block" >Home</span>
          </Link>
          <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <ExploreSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block" >Explore</span>
          </Link>
          <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <NotificationSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block" >Notifications</span>
          </Link>
          <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <MsgsSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block" >Messages</span>
          </Link>
          <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <BookmarksSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block" >Bookmarks</span>
          </Link>
          <Link href={`/user/${authState._id}`} className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <ProfileSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block">Profile</span>
          </Link>
          <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <MoreSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden xl:block" >More</span>
          </Link>
        </ul>
        < Link
          className="xl:flex  items-center py-3 px-3 w-fit rounded-full font-medium  text-white   bg-[#1D9BF0] xl:w-full"
          href={pathname + '?' + 'tweet-modal'}
        // as="/compose/tweet"
        >
          <span className="hidden w-full xl:block xl:px-6 text-center">Tweet</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="white" className="block xl:hidden w-6 h-6  mx-auto">
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z">
            </path>
          </svg>
        </Link>
      </div>

      <button className="inline-flex space-x-2.5 items-center p-2.5 w-full rounded-full font-medium hover:bg-gray-100  xl:w-full">
        {
          authState && authState.avatar
          && <Image alt="user" width={48} height={48} className="rounded-full bg-black hover:opacity-70 w-12 h-12 user-link" src={authState.avatar} />
        }
        {
          (!authState || !authState.avatar) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 user-link border border-black rounded-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        }
        <div className="hidden min-w-0 xl:block max-w-full "> 
          <div className="user-link min-w-0 text-base font-semibold  truncate ... overflow-hidden">{authState.name}</div>
          <div className="user-link max-w-full text-left text-sm  text-gray-500">@{authState?.user_name}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="hidden  xl:block w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>

      </button>
    </header>
  )
}
function BottomNavBar() {
  return (
    <>
      <ul className="fixed bg-white  flex border-t shadow justify-between  w-full sm:hidden bottom-0 left-0  h-12 ">
        <Link href='/home' className="flex place-content-center  group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <HomeSVG fill='none' strokeWidth="1.75" />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <ExploreSVG fill='none' strokeWidth="1.75" />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <NotificationSVG fill='none' strokeWidth="1.75" />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <MsgsSVG fill='none' strokeWidth="1.75" />
        </Link>
      </ul>
      <Link className="absolute right-5 bottom-16 block sm:hidden   p-4 w-fit rounded-full font-medium  text-white   bg-[#1D9BF0] md:w-full" href="?compose=tweet" as="/compose/tweet">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="white" className="block md:hidden w-8 h-8  mx-auto">
          <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z">
          </path>
        </svg>
      </Link>
    </>
  )
}
export function TopNavBar() {
  const [drawerToggle, setDrawerToggle] = useState(false)
  return (
    <>
      <ul className="fixed z-50 flex border-t bg-white shadow justify-between  w-full sm:hidden top-0 left-0  h-8 ">
        <button
          onClick={(event) => {
            event.preventDefault();
            setDrawerToggle(true)
          }}
          className="flex place-content-center  group text-base items-center  w-fit  text-gray-900 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <Link href='/#' className="flex place-`${}``${}`nt-center group text-base items-centerw-fit  text-gray-900 px-2">
          <TweetIcon fill={'#1D9BF0'} />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center  w-fit  text-gray-900 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </ul>
      {/* Drawer */}
      {
        drawerToggle &&
        <div className="fixed w-screen h-screen left-0 top-0 bg-opacity-20 bg-black">
          <div className={`${drawerToggle ? 'block sm:hidden' : 'hidden'} py-4 px-2 absolute  left-0 top-0 z-20 bg-white border h-full w-56`}>
            <div className="flex w-full items-center">
              <div className="w-full font-medium">
                Account Info
              </div>
              <button
                onClick={(event => { event.preventDefault(); setDrawerToggle(false) })}
                className=" hover:bg-gray-200 rounded-full px-2 py-1">
                X
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}
function RightSideBar() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="w-full h-fit relative   rounded-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="absolute left-4 top-2.5 w-5 h-5 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input className="p-2.5 pl-12 w-full bg-gray-100 focus:outline-none " placeholder="Search Twitter" />
      </div>
      <div className="w-full h-fit relative  bg-gray-100 rounded-xl overflow-hidden p-3">
        <h1 className="text-xl font-semibold">About this app</h1>
        <div className="my-3">
          <ul className="flex flex-col space-y-1 text-sm text-gray-800">
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />This is the deployed version of the app</li>
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />Try creating new tweet, with image</li>
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />Try Retweeting ,Liking and Commenting tweets</li>
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />Try going to users page</li>
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />All the activites done here are getting cache locally</li>
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />Respository of the complete application</li>
            <li className="flex"><div className="rounded-full bg-gray-500 w-2 h-2 m-1.5" />Created by <span className="font-medium px-2">Siddhant Deshmukh</span></li>
          </ul>
        </div>
      </div>
      <div className="w-full h-fit relative  bg-gray-100 rounded-xl overflow-hidden pt-3">
        <h1 className="text-xl font-semibold p-2">What's Happening</h1>
        <ul className="">
          <li className="p-3 hover:bg-gray-200 hover:cursor-pointer">
            <div className="flex justify-between w-full">
              <div className="flex items-center text-gray-700 text-xs">
                IPL
                <span>.</span>
                14 Minutes ago
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h1 className="font-semibold  text-gray-800">Royal Challengers Bangalore vs Lucknow Super Giants</h1>
            <div className="text-xs text-gray-700 py-1">
              10,400 Tweets
            </div>
          </li>
          <li className="p-3 hover:bg-gray-200 hover:cursor-pointer">
            <div className="flex justify-between w-full">
              <div className="flex items-center text-gray-700 text-xs">
                Sports
                <span>.</span>
                Trending
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h1 className="font-semibold  text-gray-800"> Shikhar Dhawan Viral Video</h1>
            <div className="text-xs text-gray-700 py-1">
              1,20,999 Tweets
            </div>
          </li>
          <li className="p-3 hover:bg-gray-200 hover:cursor-pointer">
            <div className="flex justify-between w-full">
              <div className="flex items-center text-gray-700 text-xs">
                Indian Premier Leagure
                <span>.</span>
                Trending
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h1 className="font-semibold  text-gray-800">#LetsGetMarried</h1>
            <div className="text-xs text-gray-700 py-1">
              1,400 Tweets
            </div>
          </li>
          <li className="p-3 hover:bg-gray-200 hover:cursor-pointer">
            <div className="flex justify-between w-full">
              <div className="flex items-center text-gray-700 text-xs">
                Trending in India
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h1 className="font-semibold  text-gray-800">Election Commission</h1>
            <div className="text-xs text-gray-700 py-1">
              11K Tweets
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
function Header() {
  const router = useRouter()
  return (
    <h1 className='flex w-full h-fit sticky space-x-10 p-3 left-0 top-0   sm:w-[620px] z-50 opacity-90 bg-white'>
      <button
        onClick={(event) => { event.preventDefault(); router.back() }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <span className='text-xl font-semibold'>
        Meow
      </span>
    </h1>
  )
}

{/* <h1 className='flex w-full space-x-10 p-3 sticky top-0 opacity-90 bg-white'>
  <button
    onClick={(event) => { event.preventDefault(); router.back() }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  </button>
  <span className='text-xl font-semibold'>
    Tweet
   
  </span>
</h1> */}
{/* <h1 className='flex w-full space-x-10 p-3 sticky top-0 opacity-90 bg-white'>

<span className='text-xl font-semibold'>
  Home
</span>
</h1> */}