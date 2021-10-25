import type { FormEvent } from "react";
import Layout from "../components/layout";

import Head from 'next/head'
import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import styles from '../styles/Home.module.css'

import { login } from "../utils/firebase";  // 上記で実装したファイル

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className={styles.container}>
        <Head>
          <title>予約管理システム</title>
          <meta name="description" content="予約管理システム" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <div>
        <h1>ログイン画面</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email:</label>

            <input
              id="email"
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>

            <input
              id="password"
              type="password"
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
          </div>

          <button type="submit">login</button>
        </form>
      </div>
      </div>
    </Layout>
  );
};

export default LoginPage;