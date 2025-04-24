import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        {/* Aquí puedes añadir más etiquetas meta, links, etc. */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}