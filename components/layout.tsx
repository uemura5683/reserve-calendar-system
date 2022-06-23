import Head from 'next/head'
import Link from 'next/link'
export const siteTitle = '予約管理システム';
import styles from '../styles/Common.module.css'

function Layout({ children
  }: {
    children: React.ReactNode
  }) {
    return (
    <div className={styles.wrapper}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="予約管理システムのサイトです。"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/Nu%20Stack.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-white-logo.svg&images=https%3A%2F%2Fuemu-engineer.com%2Fimages%2Flogo.png&widths=undefined&widths=350&heights=undefined&heights=100`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="stylesheet" href="/styles/foundation/base.css"></link>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.headerlogo}><Link href="/">予約管理システム</Link></h1>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerinner}>
          <div className={styles.copyrignt}>***********</div>
        </div>
      </footer>
    </div>
  )
}

export default Layout