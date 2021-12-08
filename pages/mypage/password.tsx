import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";

import { useState } from "react";
import type { FormEvent } from "react";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";

import { firebaseAdmin } from "../../firebaseAdmin";
import { getFirebaseAuth, passwordupdate, logout } from "../../utils/firebase";

import styles from '../../styles/Mypage.module.css'

const LoginPage: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const onLogout = async () => {
    await logout(); // ログアウトさせる
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    let auth = getFirebaseAuth();
    if( password != null ) {
      try {
        passwordupdate(auth, password);
        router.push("/mypage/passwordcomplete"); //トップページへ遷移させる
      } catch( err ) {
        alert('送信失敗しました。');
      }
    } else {
      if(password == '') {
        alert('パスワードを入力してください。');
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
          <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">Nu-stack</a></Link>
        </nav>
        <h2 className={styles.title}>パスワード変更</h2>
        <form onSubmit={onSubmit}>
          <div className="form-contnt">
            <div className="label-content">
              <label htmlFor="password">パスワード:</label>
              <input
                id="password"
                value={password}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <button type="submit">送信する</button>
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