import Layout from '@/components/Layout'
import { AuthContextProvider } from '@/context/authContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

// export function reportWebVitals(metric) {
//   console.log(metric)
// }

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Head>
        <title>Twitter</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  )
}
