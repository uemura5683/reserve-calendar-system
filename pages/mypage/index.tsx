import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";

import { logout} from "../../utils/firebase";
import { firebaseAdmin } from "../../firebaseAdmin";

import stylecommon from '../../styles/Common.module.css'
import stylemypage from '../../styles/Mypage.module.css'

const Mypage: NextPage<{ user: any }> = ({ user }) => {
  const router = useRouter();

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログインページへ遷移させる
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
          <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">Nu-stack</a></Link>
        </nav>
        <main className={stylecommon.main}>
          <h2 className={stylecommon.title}>マイページ</h2>
          <div className={stylemypage.mypage_content}>
            { user ? (
              <>
                <h3 className={stylemypage.mypage_address}>ユーザーアドレス<br />{user.email}</h3>
              </>
            ) : null }
            <div className={stylemypage.mypage_contentinner}>
              <ul>
                <li><Link href="/order/calendar">予約状況</Link></li>
                <li><Link href="/mypage/mailaddress">メールアドレス変更</Link></li>
                <li><Link href="/mypage/password">パスワード変更</Link></li>
                <li><Link href="/mypage/withdrawal">退会</Link></li>
              </ul>
            </div>
          </div>
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