import { IUser } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { BookmarksSVG, ExploreSVG, HomeSVG, MoreSVG, MsgsSVG, NotificationSVG, ProfileSVG, TweetIcon } from "../svgElemets";


function SideNavbar({ authState }: { authState: IUser }) {
    const searchParams = useSearchParams()
    const pathname = usePathname();

    const router = useRouter();

    const [showHiddenMenu, setToggle] = useState<boolean>(false)
    return (
        <header className="ml-auto hidden sm:flex  flex-col px-1.5 xl:px-0.5 pt-2 pb-3   h-full justify-between  sm:w-[68px] xl:w-[272px] ">
            <div className="flex flex-col px-1 xl:px-[18px]">
                <Link href={'/home'} className="p-2 mx-1 hover:bg-blue-50 dark:hover:bg-gray-800 w-fit rounded-full">
                    <TweetIcon fill={'#1D9BF0'} />
                </Link>
                <ul className="my-4 px-1 flex flex-col space-y-4">
                    <div>
                        {
                            searchParams.get('tweet-modal')
                        }
                    </div>
                    <Link href='/home' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
                        <HomeSVG fill='none' strokeWidth="1.75" />
                        <span className="px-3 hidden xl:block" >Home</span>
                    </Link>
                    <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
                        <ExploreSVG fill='none' strokeWidth="1.75" />
                        <span className="px-3 hidden xl:block" >Explore</span>
                    </Link>
                    <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
                        <NotificationSVG fill='none' strokeWidth="1.75" />
                        <span className="px-3 hidden xl:block" >Notifications</span>
                    </Link>
                    <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
                        <MsgsSVG fill='none' strokeWidth="1.75" />
                        <span className="px-3 hidden xl:block" >Messages</span>
                    </Link>
                    <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
                        <BookmarksSVG fill='none' strokeWidth="1.75" />
                        <span className="px-3 hidden xl:block" >Bookmarks</span>
                    </Link>
                    <Link href={`/user/${authState._id}`} className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
                        <ProfileSVG fill='none' strokeWidth="1.75" />
                        <span className="px-3 hidden xl:block">Profile</span>
                    </Link>
                    <Link href='#' className="flex group text-xl items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 w-fit p-2 rounded-full text-gray-900 dark:text-white">
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



            <div className="relative w-full">
                <button
                    onClick={(event) => {
                        event.preventDefault()
                        console.log("Meow")
                        setToggle(prev => !prev)
                    }}
                    className="flex space-x-2.5 items-center p-2.5 w-full rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 xl:w-full" >
                    {
                        authState && authState.avatar
                        && <Image alt="user" width={48} height={48} className="rounded-full bg-black hover:opacity-70 w-12 min-w-[48px] h-12 user-link" src={authState.avatar} />
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
                <div className={`${(showHiddenMenu) ? 'block' : 'hidden'} absolute -left-5 -top-24 shadow dark:shadow-gray-600 rounded-2xl border dark:bg-black dark:border-gray-800  w-[300px]  z-50`}>
                    <button className="w-full font-medium text-lg text-left p-5 hover:bg-gray-100 dark:hover:bg-gray-900 ">
                        Log out @{authState.user_name}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default SideNavbar