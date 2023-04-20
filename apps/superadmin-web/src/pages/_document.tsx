/* eslint @next/next/no-head-element: 0 */
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Head />
      </head>
      <body className="">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}