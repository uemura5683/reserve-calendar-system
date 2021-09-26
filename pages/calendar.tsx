import Head from 'next/head'
import Layout from "../components/layout";
import Link from 'next/link'
import styles from '../styles/Calendar.module.css'

export default function Calendar() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Calendar</title>
          <meta name="description" content="Calendar" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

      </div>
    </Layout>
  )
}
