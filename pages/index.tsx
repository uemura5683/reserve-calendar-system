import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>予約管理システム</title>
          <meta name="description" content="予約管理システム" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>予約管理システム</h1>
          <p>
            このサイトは●●●●の予約管理ツールです。
          </p>
          <Link href="/login">
              ログインする
          </Link>
          <Link href="/calendar">
            予約する
          </Link>
        </main>
      </div>
    </Layout>
  )
}
