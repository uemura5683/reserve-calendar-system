import Head from 'next/head'
import Link from 'next/link'
import axios from "axios"
import Layout from "../../components/layout";
import { useCallback, useState, useEffect } from "react";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";

import { firebaseAdmin } from "../../firebaseAdmin";
import { logout} from "../../utils/firebase";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import { INITIAL_EVENTS } from "../../utils/event-utils";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import stylecommon from '../../styles/Common.module.css'
import stylecalendar from '../../styles/Calendar.module.css'

const Calendarpage: NextPage<{ user: any, myEvents:any, handleClick:any, handleSelect:any, selectInfo:any, eventsource:any }> = ({ user, myEvents, handleClick, handleSelect, selectInfo, eventsource }) => {

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログインページへ遷移させる
  };
  const router = useRouter()
     ,  [calendar, setUsers] = useState([])
     ,  urls = 'https://www.googleapis.com/calendar/v3/calendars/' + process.env.GMAIL + '/events?key=' + process.env.GOOGLEAPI;

  useEffect(() => {
    axios.get(urls)
      .then(res => setUsers(res.data))
      .catch(error => console.log(error));
  }, [] );


  let myEvent:any = [];

  if( 'items' in calendar ) {

    let calendar_data:any = calendar
      , calendar_item:any = calendar_data.items;

      calendar_item.forEach(function(is_data:any) {
        myEvent.push ({
          'start': is_data.start.date,
          'end': is_data.end.date,
          'title': is_data.summary
        }
      )
    });
  }


  handleClick = ({info}: {info:any}) => {}

  handleSelect = () => {}

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
            plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin, googleCalendarPlugin]}
            initialView="dayGridMonth"
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
            events={myEvent}
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