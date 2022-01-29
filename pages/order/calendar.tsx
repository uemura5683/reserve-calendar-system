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
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

import { INITIAL_EVENTS, createEventId } from "../../utils/event-utils";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import stylecommon from '../../styles/Common.module.css'
import stylecalendar from '../../styles/Calendar.module.css'


const Calendarpage: NextPage<{ user: any, myEvents:any, handleClick:any, handleSelect:any, selectInfo:any }> = ({ user, myEvents, handleClick, handleSelect, selectInfo }) => {

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログインページへ遷移させる
  };
  const router = useRouter();


  handleClick = ({info}: {info:any}) => {
  }

  handleSelect = () => {
  }

  myEvents = [
    {
      id: 0,
      title: "event 1",
      start: "2022-01-24 10:00:00",
      end: "2022-01-24 11:00:00",
      memo: "memo1",
    },
    {
      id: 1,
      title: "event 2",
      start: "2022-01-25 10:00:00",
      end: "2022-01-25 11:00:00",
      memo: "memo2",
    },
  ];
  
  const renderForm = () => {
    return (
      <>
        <div className={stylecommon.containerform}>
        </div>
      </>
    )
  }

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
          {renderForm}
          <FullCalendar
            plugins={[interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            slotDuration="00:30:00" // 表示する時間軸の最小値
            selectable={true} // 日付選択可能
            allDaySlot={false} // alldayの表示設定
            nowIndicator={true}
            editable={true}
            locale='ja'
            initialEvents={INITIAL_EVENTS}
            titleFormat={{
              year: "numeric",
              month: "short",
              day: "numeric",
            }} // タイトルに年月日を表示
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "0:00",
              endTime: "24:00",
            }}
            select={handleSelect}
            eventClick={handleClick}
            weekends={true} // 週末表示
            events={myEvents}
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