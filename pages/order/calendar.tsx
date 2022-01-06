import Head from 'next/head'
import Link from 'next/link'
import Layout from "../../components/layout";
import { useCallback, useState } from "react";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";

import { firebaseAdmin } from "../../firebaseAdmin";
import { logout} from "../../utils/firebase";

import FullCalendar, { DateSelectArg, EventApi } from "@fullcalendar/react";
import interactionPlugin, { DateClickArg }  from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { INITIAL_EVENTS, createEventId } from "../../utils/event-utils";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import stylecommon from '../../styles/Common.module.css'
import stylecalendar from '../../styles/Calendar.module.css'

const thisMonth = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const Calendarpage: NextPage<{ user: any }> = ({ user }) => {

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログインページへ遷移させる
  };

  const handleDateClick = useCallback((arg: DateClickArg) => {
    alert(arg.dateStr);
  }, []);

  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Calendar" />
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
        <h2 className={stylecommon.title}>スケジュール一覧</h2>
        <div className={stylecommon.stylecalendar}>
          <FullCalendar
            plugins={[interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            nowIndicator={true}
            editable={true}
            locale='ja'
            businessHours={false}
            initialEvents={INITIAL_EVENTS}
            titleFormat={{
              year: "numeric",
              month: "short",
              day: "numeric",
            }} // タイトルに年月日を表示
            events={[
              { title: "event 1", date: `${thisMonth()}-01` },
              { title: "event 2", date: `${thisMonth()}-02` },
            ]}
            dateClick={handleDateClick}
          />
        </div>
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

export default Calendarpage;