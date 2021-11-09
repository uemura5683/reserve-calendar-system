import Head from 'next/head'
import Link from 'next/link'
import Layout from "../components/layout";

import { useState } from "react";
import type { FormEvent } from "react";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";

import { firebaseAdmin } from "../firebaseAdmin";
import { getFirebaseAuth, password,logout } from "../utils/firebase";

import styles from '../styles/Login.module.css'

const LoginPage: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const onLogout = async () => {
    await logout(); // ログアウトさせる
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    let auth = getFirebaseAuth();
    if( email != null ) {
      try {
        await password(email); // email・passwordを使ってログイン
        router.push("/passwordreset"); //トップページへ遷移させる
      } catch( err ) {
        alert('email情報が正しくありません');
      }
    } else {
      if(email == '') {
        alert('emailを入力してください。');
      }
    }
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
        <h2>パスワードリマインダー</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email:</label>

            <input
              id="email"
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <button type="submit">送信する</button>
        </form>
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

export default LoginPage;