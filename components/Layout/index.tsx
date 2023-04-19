import { AuthContext } from "@/context/authContext"
import { ReactNode, useContext } from "react"
import Login from "./Login"
import { useSearchParams } from 'next/navigation';
import TweetModal from "../modals/TweetModal"
import Loading from "../Loading"
import SideNavbar from "./SideNavbar"
import BottomNavBar from "./BottomNavbar"
import RightSideBar from "./RightSidebar"

export default function Layout({ children }: { children: ReactNode }) {
  const { authLoading, authState, setAuthState } = useContext(AuthContext)
  const searchParams = useSearchParams()

  const openTweetModal = searchParams.has('tweet-modal')
  const openUsersModal = searchParams.getAll('user-list')
  // console.log('search parameters ', searchParams.has('tweet-modal'))

  if (authLoading) {
    return (
      // bg-contain  bg-left-bottom bg-no-repeat
      <div className='flex w-screen h-screen   items-center  dark:bg-black dark:text-white'
        >
        <div className="w-fit mx-auto">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill={'#1D9BF0'} className="w-20 h-20  mx-auto mb-24">
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
          </svg>
          <Loading size={8} />
        </div>
      </div>
    )
  } else if (!(authState && authState._id)) {
    return (
      <Login />
    )
  } else {
    return (
      <div className="flex relative h-screen w-screen dark:bg-black dark:text-white">
        <div className=" flex h-full w-full">

          <main
            className="relative overflow-y-auto w-full sm:mx-0 side-left-padding pt-13 sm:pt-0   pb-12  sm:pb-0"
          >
            <div className="flex w-fit">
              <div className="hidden sm:block sticky  top-0 h-screen w-fit px-2 border-r  border-r-gray-200 dark:border-gray-800">
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


