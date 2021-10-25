import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";
import { firebaseAdmin } from "../firebaseAdmin";
import Link from 'next/link'

const IndexPage: NextPage<{ email: string }> = ({ email }) => {
  const router = useRouter();

  return (
    <>
      <Link href="/login">ログイン</Link>
      <Link href="/customer">会員登録</Link>
      <Link href=""><a href="https://uemu-engineer.com/" target="_blank" rel="noreferrer">Nu-stack</a></Link>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = nookies.get(ctx);
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
          email: 'ゲスト',
        },
      };
    }
    return {
      props: {
        email: user.email,
      },
    };
  };

export default IndexPage;