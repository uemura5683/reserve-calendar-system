import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";

import { firebaseAdmin } from "../../firebaseAdmin";
import { getFirebaseAuth, logout, signup} from '../../utils/firebase'

import stylecommon from '../../styles/Common.module.css'
import stylecustomer from '../../styles/Customer.module.css'


const SignUp: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // ログアウトさせる
  const onLogout = async () => {
    await logout(); 
    router.push("/customer/logout"); 
  };

  // 会員登録する
  const createUser = async (event: FormEvent) => {
    event.preventDefault()
    try {
      signup(router, getFirebaseAuth, email, password);
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
        <h2 className={stylecommon.title}>新規会員登録</h2>
        <form className="auth" onSubmit={createUser}>
            <div className={stylecommon.formcont}>
              <div className={stylecommon.labelcontent}>
                <label
                  className={stylecommon.labelinput}
                  htmlFor="email">
                  Email:{' '}
                </label>
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={stylecommon.labelcontent}>
                <label
                  htmlFor="password"
                  className={stylecommon.labelinput}
                >
                  Password:{' '}
                </label>
                <input
                  id="password"
                  className="auth-input"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className={stylecommon.inputbutton} type="submit">
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