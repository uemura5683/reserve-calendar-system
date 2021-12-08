import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";

import { firebaseAdmin } from "../../firebaseAdmin";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth, logout } from '../../utils/firebase'

import styles from '../../styles/Customer.module.css'


const SignUp: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const auth = getFirebaseAuth();

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログインページへ遷移させる
  };

  const createUser = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/customer/signupcomplete')
    } catch (err: any) {
       alert(err.message);
    }
  }

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
        <h2 className={styles.title}>新規会員登録</h2>
        <form className="auth" onSubmit={createUser}>
            <div className="form-contnt">
              <div className="label-content">
                <label htmlFor="email" className="auth-label">
                    Email:{' '}
                </label>
                <input
                    id="email"
                    className="auth-input"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="label-content">
                <label htmlFor="password" className="auth-label">
                    Password:{' '}
                </label>
                <input
                    id="password"
                    className="auth-input"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="auth-btn" type="submit">
                会員登録する
              </button>
            </div>
        </form>
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

export default SignUp;