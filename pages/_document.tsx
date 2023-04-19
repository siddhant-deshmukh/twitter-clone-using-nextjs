import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Twitter Clone made just for fun!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/twitter.svg" sizes='any' type='image/svg+xml' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
