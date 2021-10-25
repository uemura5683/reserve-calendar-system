import type { GetServerSideProps } from "next";
import Head from 'next/head'
import Layout from "../components/layout";

import nookies from "nookies";
import { firebaseAdmin } from "../firebaseAdmin";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import styles from '../styles/Calendar.module.css'

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
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      email: user.email,
    },
  };
};

export default function Calendar() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Calendar</title>
          <meta name="description" content="Calendar" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <FullCalendar
          plugins={[interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          nowIndicator={true}
          editable={true}
          initialEvents={[{ title: "Initial event", start: new Date() }]}
        />
      </div>
    </Layout>
  )
}
