import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";
import React from "react";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";

import { firebaseAdmin } from "../../firebaseAdmin";
import { logout} from "../../utils/firebase";

import stylecommon from '../../styles/Common.module.css'
import Calendar from '../../components/order/calendar'

const Calendarpage: NextPage<{ user: any }> = ( { user } ) => {
  const router = useRouter();

  // ログアウト
  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログアウトページへ遷移させる
  };
  
  return (
    <Layout>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Calendar" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/page/calendar.css"></link>
      </Head>
      <div className={stylecommon.container}>
        <nav className={stylecommon.nav}>
          {user ? (
              <>
                <a onClick={onLogout}>ログアウト</a>
                <Link href="/mypage/">マイページ</Link>
              </>
            ) : (
              <>
                <Link href="/customer/login">ログイン</Link>
                <Link href="/customer/signup">会員登録</Link>
              </>
          ) }
          <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">U-stack</a></Link>
        </nav>
        <h2 className={stylecommon.title}>スケジュール一覧</h2>
        <Calendar data={user}/>
      </div>
    </Layout>
  )
}

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
      props: {
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

export default Calendarpage;