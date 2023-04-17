import { AuthContext } from '@/context/authContext'
import React, { useContext, useState } from 'react'

const Login = () => {

  const { setAuthState } = useContext(AuthContext)
  const [loading, setLoading] = useState<boolean>(false)
  const login = () => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) {
          setAuthState(data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div
      className='w-screen h-screen fixed  left-0 top-0  bg-opacity-50 '
    >

      {/* <img src="/twiiter-3d-logo.jpg"/> */}
      <div className='w-full h-full bg-contain  bg-left-bottom bg-no-repeat flex items-center bg-white lg:bg-[url("/3d-twitter.png")]'
            >
        <div className='mx-auto lg:ml-auto lg:mr-10 xl:mr-96 w-[500px] h-fit rounded-2xl p-5 border bg-white  bg-opacity-90 shadow-lg '>
          <div className='mx-auto w-fit flex items-center space-x-4'>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill={'#1D9BF0'} className="w-10 h-10  ">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
            </svg>
          </div>
          <h1 className='mt-3 text-3xl mx-auto w-fit  font-medium '>
            Twitter Clone
          </h1>
          <p className='my-6 text-center mx-auto w-fit max-w-xs '>
            A basic twitter clone made using NextJS, SWR and MongoDB
          </p>
          <div className='mx-auto w-fit my-20'>
            <button className=' text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              disabled={loading}
              onClick={(event) => {
                event.preventDefault();
                setLoading(true)
                if (loading) return;
                login();
              }}>
              Get Temprary Acess
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login