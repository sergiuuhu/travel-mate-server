import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#35363a" />
        <meta name="msapplication-TileColor" content="#35363a" />
        <meta name="theme-color" content="#35363a" />

        <title>citybreak.pro - Find a cheap city break</title>
        <meta name="title" content="citybreak.pro - Find a cheap city break" />
        <meta
          name="description"
          content=""
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.citybreak.pro/" />
        <meta property="og:title" content="citybreak.pro - Find a cheap city break" />
        <meta
          property="og:description"
          content=""
        />
        <meta property="og:image" content="https://www.citybreak.pro/cover.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.citybreak.pro/" />
        <meta property="twitter:title" content="citybreak.pro - Find a cheap city break" />
        <meta
          property="twitter:description"
          content=""
        />
        <meta property="twitter:image" content="https://www.citybreak.pro/cover.png" />
      </Head>

      <main>{children}</main>
    </>
  )
}