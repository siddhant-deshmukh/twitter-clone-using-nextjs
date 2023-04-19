
function RightSideBar() {
    return (
        <div className="flex flex-col space-y-3 pt-5">
            <div className="w-full h-fit relative   rounded-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="absolute left-4 top-2.5 w-5 h-5 text-gray-700 dark:text-gray-300 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input className="p-2.5 pl-12 w-full bg-gray-100 dark:bg-gray-900  focus:outline-none " placeholder="Search Twitter" />
            </div>
            <div className="w-full h-fit relative  bg-gray-100 dark:bg-gray-900  rounded-xl overflow-hidden p-3">
                <h1 className="text-xl font-semibold">About this app</h1>
                <div className="my-3">
                    <ul className="flex flex-col space-y-1 text-sm text-gray-800 dark:text-gray-200 ">
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
            <div className="w-full h-fit relative  bg-gray-100 dark:bg-gray-900 dark:border-gray-800 rounded-xl overflow-hidden pt-3">
                <h1 className="text-xl font-semibold p-2">What is Happening</h1>
                <ul className="">
                    <li className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer">
                        <div className="flex justify-between w-full">
                            <div className="flex items-center text-gray-700 dark:text-gray-300 text-xs">
                                IPL
                                <span>.</span>
                                14 Minutes ago
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <h1 className="font-semibold  text-gray-800 dark:text-gray-200">Royal Challengers Bangalore vs Lucknow Super Giants</h1>
                        <div className="text-xs text-gray-700 dark:text-gray-300 py-1">
                            10,400 Tweets
                        </div>
                    </li>
                    <li className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer">
                        <div className="flex justify-between w-full">
                            <div className="flex items-center text-gray-700 dark:text-gray-300 text-xs">
                                Sports
                                <span>.</span>
                                Trending
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <h1 className="font-semibold  text-gray-800 dark:text-gray-200"> Shikhar Dhawan Viral Video</h1>
                        <div className="text-xs text-gray-700 dark:text-gray-300 py-1">
                            1,20,999 Tweets
                        </div>
                    </li>
                    <li className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer">
                        <div className="flex justify-between w-full">
                            <div className="flex items-center text-gray-700 dark:text-gray-300 text-xs">
                                Indian Premier Leagure
                                <span>.</span>
                                Trending
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <h1 className="font-semibold  text-gray-800 dark:text-gray-200">#LetsGetMarried</h1>
                        <div className="text-xs text-gray-700 dark:text-gray-300 py-1">
                            1,400 Tweets
                        </div>
                    </li>
                    <li className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer">
                        <div className="flex justify-between w-full">
                            <div className="flex items-center text-gray-700 dark:text-gray-300 text-xs">
                                Trending in India
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <h1 className="font-semibold  text-gray-800 dark:text-gray-200">Election Commission</h1>
                        <div className="text-xs text-gray-700 dark:text-gray-300 py-1">
                            11K Tweets
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default RightSideBar