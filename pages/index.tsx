import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from "../components/desktop/layout"
import { NextPageWithLayout } from './_app'
import { ReactElement } from 'react'

const inter = Inter({ subsets: ['latin'] })

const Home : NextPageWithLayout= () =>{
  return (
    <>
      <div className="text-3xl font-bold underline">
        Hello world!
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement){
  return(
    <Layout>
      {page}
    </Layout>
  )
}

export default Home
