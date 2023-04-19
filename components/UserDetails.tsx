import { IUser } from '@/models/User'
import Image from 'next/image'
import React from 'react'

const UserDetails = ({ authorDetails }: { authorDetails: IUser }) => {
  return (
    <div className='w-full'>
      <div className='w-full relative'>
        <div className='h-48 bg-gradient-to-r to-blue-400 from-gray-200 dark:to-blue-500 dark:from-gray-800 w-full'></div>
        <div className='absolute w-fit h-fit left-5 top-28'>
          <Image width={144} height={144} alt="image" className='w-36 h-36 rounded-full  p-1 bg-white dark:bg-gray-900' src={authorDetails.avatar || ""} />
        </div>
        <div className='w-full px-4 py-2'>
          <div className='flex w-fit ml-auto mb-5'>
            {
              authorDetails.doesFollow &&
              <div className='group'>
                <button className='border rounded-full py-1.5 w-24 block group-hover:hidden font-medium border-gray-300'>Following</button>
                <button className='border rounded-full py-1.5 w-24 hidden group-hover:block font-medium border-red-700 text-red-700 bg-red-50'>Unfollow</button>
              </div>
            }
            {
              !authorDetails.doesFollow &&
              <button className='border rounded-full bg-slate-900 text-white font-medium py-1.5 px-4'>Follow</button>
            }
          </div>
          <div className='font-bold text-xl h-fit'>{authorDetails.name}</div>
          <div className='text-sm text-gray-500'>@{authorDetails.user_name}</div>

          <div className='my-3'>{authorDetails.about}</div>
          <ul className="w-full flex justify-start space-x-3">
            <button className="flex  group">
              <span className="text-black dark:text-white font-semibold group-hover:underline">{authorDetails.num_following || 78}&nbsp;</span>
              <span className="text-gray-500 dark:text-gray-400 group-hover:underline w-fit">Following</span>
            </button>
            <button className="flex  h-fit group">
              <span className="text-black dark:text-white font-semibold group-hover:underline">{authorDetails.num_followers || 27}&nbsp;</span>
              <span className="text-gray-500 dark:text-gray-400 group-hover:underline w-fit">Followers</span>
            </button>
          </ul>
        </div>
        <div>

        </div>
      </div>
    </div>
  )
}

export default UserDetails