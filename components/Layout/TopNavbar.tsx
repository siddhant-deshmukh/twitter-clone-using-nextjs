import { IUser } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TweetIcon } from "../svgElemets";

function TopNavBar({ authState }: { authState: IUser }) {
    const [drawerToggle, setDrawerToggle] = useState(false)
    const pathname = usePathname();
    // console.log(pathname)
    if (pathname === '/home') {
        return (
            <>
                <ul className="z-50 flex items-center h-full justify-between  w-full sm:hidden top-0 left-0  ">
                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            // setDrawerToggle(true)
                        }}
                        className="flex place-content-center  group text-base items-center  w-fit  text-gray-900 dark:text-white px-2">
                        {
                            authState && authState.avatar
                            && <Image alt="user" width={48} height={48} className="rounded-full bg-black hover:opacity-70 w-10 h-10 user-link" src={authState.avatar} />
                        }
                        {
                            (!authState || !authState.avatar) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 user-link border border-black rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        }
                    </button>
                    <Link href='#' className="flex place-`${}``${}`nt-center group text-base items-centerw-fit  text-gray-900 dark:text-white px-2">
                        <TweetIcon fill={'#1D9BF0'} />
                    </Link>
                    <Link href='#' className="flex place-content-center group text-base items-center  w-fit  text-gray-900 dark:text-white px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Link>
                </ul>
                {/* Drawer */}
                {
                    drawerToggle &&
                    <div className="fixed w-screen h-screen left-0 top-0 bg-opacity-80 bg-black dark:bg-slate-800 dark:bg-opacity-80 z-[60]">
                        <div className={`${drawerToggle ? 'block sm:hidden' : 'hidden'} py-4 px-2 absolute  left-0 top-0 z-20 bg-white dark:bg-black border h-full w-56`}>
                            <div className="flex w-full items-center">
                                <div className="w-full font-medium">
                                    Account Info
                                </div>
                                <button
                                    onClick={(event => { event.preventDefault(); setDrawerToggle(false) })}
                                    className=" hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full px-2 py-1">
                                    X
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default TopNavBar