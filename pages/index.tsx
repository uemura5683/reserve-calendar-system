import Head from 'next/head'
import Link from 'next/link'
import Layout from "../components/layout";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";
import { firebaseAdmin } from "../firebaseAdmin";

import styles from '../styles/Home.module.css'

const IndexPage: NextPage<{ email: string }> = ({ email }) => {
  const router = useRouter();

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
          <h2>ようこそ {email}様</h2>
          <p>
            このサイトは●●●●の予約管理ツールです。
          </p>
          <Link href="/calendar">
            予約する
          </Link>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log(context);

    const cookies = nookies.get(context);
    const session = cookies.session || "";
  
    // セッションIDを検証して、認証情報を取得する
    const user = await firebaseAdmin
      .auth()
      .verifySessionCookie(session, true) 
      .catch(() => null);
  
    // 認証情報が無い場合は、ログイン画面へ遷移させる
    if (!user) {
      return {
        props: {
          email: 'ゲスト',
        },
      };
    }
  
    return {
      props: {
        email: user.email,
      },
    };
  };

export default IndexPage;