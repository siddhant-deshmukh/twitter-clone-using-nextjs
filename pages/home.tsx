import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from "../components/desktop/layout"
import { NextPageWithLayout } from './_app'
import { ReactElement } from 'react'
import SideBar from '../components/desktop/SideBar'
import LoginBtn from '../components/login-button'
const inter = Inter({ subsets: ['latin'] })

const Home : NextPageWithLayout= () =>{
  return (
    <>
      <main>
        <div className='text-bold'>Home</div>
        <LoginBtn />
      </main>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement){
  return(
    <Layout >
      {page}
    </Layout>
  )
}

export default Home
