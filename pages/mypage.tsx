import Head from 'next/head'
import Link from 'next/link'
import Layout from "../components/layout";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";

import { logout} from "../utils/firebase";
import { firebaseAdmin } from "../firebaseAdmin";

import styles from '../styles/Home.module.css'

const Mypage: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter();

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/logout"); // ログインページへ遷移させる
  };
  
  return (
    <Layout>
      <Head>
        <title>予約管理システム</title>
        <meta name="description" content="予約管理システム" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <nav>
          {user ? (
              <>
                <a onClick={onLogout}>ログアウト</a>
                <Link href="/mypage">マイページ</Link>
              </>
            ) : (
              <>
                <Link href="/login">ログイン</Link>
                <Link href="/signup">会員登録</Link>
              </>
          ) }
          <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">Nu-stack</a></Link>
        </nav>
        <main className={styles.main}>
          <h2 className={styles.title}>予約管理システム</h2>
          { user ? (
            <>
              <h3>こんにちは {user.email}様</h3>
            </>
          ) : null }
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

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
        redirect: {
          destination: "/login",
          permanent: false,
          user: null
        },
      };
    }
    return {
      props: {
        user: user
      },
    };
  };

export default Mypage;