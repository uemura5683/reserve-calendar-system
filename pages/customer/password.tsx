import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";

import { useState } from "react";
import type { FormEvent } from "react";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";

import { firebaseAdmin } from "../../firebaseAdmin";
import { getFirebaseAuth, password,logout } from "../../utils/firebase";

import stylecommon from '../../styles/Common.module.css'

const LoginPage: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // ログアウト
  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログアウトページへ遷移させる
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    let auth = getFirebaseAuth();
    if( email != '' ) {
      try {
        await password(email); // 新しいパスワードを入力する
        router.push("/customer/passwordcomplete"); //パスワードリセット完了ページに遷移する
      } catch( err ) {
        alert('Eメール情報が正しくありません');
      }
    } else {
      if(email == '') {
        alert('メールアドレスを入力してください');
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
        <h2 className={stylecommon.title}>パスワードリマインダー</h2>
        <form onSubmit={onSubmit}>
          <div className={stylecommon.formcont}>
            <div className={stylecommon.labelcontent}>
              <label
                className={stylecommon.labelinput}
                htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                value={email}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <button className={stylecommon.inputbutton} type="submit">送信する</button>
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