import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'

import TweetEditor from '../Tweet/TweetEditor'


const TweetModal = () => {
  const pathname = usePathname()
  const router = useRouter()

  const closeModal = () => {
    router.push(pathname)
  }
  return (
    <div className='fixed left-0 right-0 z-50 bg-black dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 w-screen h-screen overflow-y-auto py-14  px-2'>
      <div className='w-full max-w-[600px] h-fit bg-white dark:bg-black  mx-auto rounded-2xl overflow-hidden '>
        <header className='flex items-center justify-between   w-full'>
          <button
            className='w-10 h-10 text-lg hover:bg-gray-200 dark:hover:bg-gray-800 mt-2 mx-2 rounded-full '
            onClick={(event) => {
              event.preventDefault();
              closeModal()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className='min-h-[200px]  relative flex max-h-full'>
          <TweetEditor closeModal={closeModal} />
        </main>
      </div>
    </div>
  )
}

export default TweetModal