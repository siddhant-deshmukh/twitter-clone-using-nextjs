import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'
import { AppProvider } from '../context/TwitterContext'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps:{session , ...pageProps} }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return <SessionProvider session={session}>
      <AppProvider>
        {getLayout(
          <Component {...pageProps} />
          )
        }
      </AppProvider>
  </SessionProvider>
}