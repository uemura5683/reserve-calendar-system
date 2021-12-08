import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";

import { useState } from "react";
import type { FormEvent } from "react";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";

import { firebaseAdmin } from "../../firebaseAdmin";
import { login, logout } from "../../utils/firebase";

import styles from '../../styles/Customer.module.css'

const LoginPage: NextPage<{ user: any }> = (user) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogout = async () => {
    await logout(); // ログアウトさせる
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする

    if( email != null && password != null ) {
      try {
        await login(email, password); // email・passwordを使ってログイン
        router.push("/"); //トップページへ遷移させる
      } catch( err ) {
        alert('ログイン情報が正しくありません');
      }
    } else {
      if(email == '') {
        alert('emailを入力してください。');
      }
      if(password == '') {
        alert('passwordを入力してください。');
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
        <nav className={styles.nav}>
          {user.user ? (
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
          <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">Nu-stack</a></Link>
        </nav>
        <h2 className={styles.title}>ログイン</h2>
        <form onSubmit={onSubmit}>
          <div className="form-contnt">
            <div className="label-content">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                value={email}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div className="label-content">
            <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <button type="submit">login</button>
            <Link href="/customer/password">パスワードお忘れの方はこちら</Link>
          </div>
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