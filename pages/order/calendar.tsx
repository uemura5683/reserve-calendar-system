import Head from 'next/head'
import Link from 'next/link'
import axios from "axios"
import Layout from "../../components/layout";
import { useState, useEffect } from "react";

import type { GetServerSideProps, NextPage } from "next";
import nookies from "nookies";
import { useRouter } from "next/router";

import { firebaseAdmin } from "../../firebaseAdmin";
import { logout} from "../../utils/firebase";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { INITIAL_EVENTS } from "../../utils/event-utils";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import stylecommon from '../../styles/Common.module.css'
import stylecalendar from '../../styles/Calendar.module.css'

const Calendarpage: NextPage<{ user: any }> = ( { user } ) => {

  // ログアウト
  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/customer/logout"); // ログインページへ遷移させる
  };

  // Googleカレンダー・FullCalendar連携
  const router = useRouter()
      , [calendar, setUsers] = useState([])
      , urls = 'https://www.googleapis.com/calendar/v3/calendars/' + process.env.GMAIL_USER + '/events?maxResults=3000&key=' + process.env.GOOGLEAPI;

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
          'start': is_data.start.dateTime,
          'end': is_data.end.dateTime,
          'title': is_data.visibility == 'public' ? is_data.summary : '非公開',
          'id': is_data.id
        }
      )
    });
  }

  // イベント詳細を出力
  const [calendardate, eventClick] = useState<any>('');
  if(calendardate != '') {
    console.log(calendardate.event);
  }

  // エントリー
  const entryform = () => {
    if( user ) {
      console.log('エントリーします');
    } else {
      console.log('ログインしてください');
    }

  }

  // 1日のスケジュールを表示
  const daydateform = (daydate:any) => {
    if( user ) {
      console.log(daydate.dayEl);
    } else {
      console.log('ログインしてください');
    }
  }

  // 一日の詳細を出力
  const entryClick = (daydate:any) => {
    let elements = daydate.dayEl.getElementsByClassName('fc-daygrid-event-harness');
    if( elements.length == 0) {
      entryform();
    } else {
      daydateform(daydate);
    }
  }

  // Weekly Monthly
  const [initial, setinitial] = useState(true);
  const toggle = () => setinitial(!initial)
  const initialViewString:any = initial ? 'timeGridWeek' : 'dayGridMonth';

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
        <div className={stylecalendar.togglemenu}>
          <button onClick={toggle} className={initial ? `${stylecalendar.open}` : `${stylecalendar.hidden}`}>Weekly</button>
          <button onClick={toggle} className={initial ? `${stylecalendar.hidden}` : `${stylecalendar.open}`}>Monthly</button>
        </div>
        <div className={stylecalendar.stylecalendar}>
          {entryform}
          {daydateform}
          <div className={initial ? `${stylecalendar.open} ${stylecalendar.stylecalendarinner}` : `${stylecalendar.hidden} ${stylecalendar.stylecalendarinner}`}>
            <FullCalendar
              plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
              initialView='timeGridWeek'
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
              }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: "0:00",
                endTime: "24:00",
              }}
              weekends={true} // 週末表示
              events={myEvent}
              dateClick={entryClick}
              eventClick={eventClick}
            />
          </div>
          <div className={initial ? `${stylecalendar.hidden} ${stylecalendar.stylecalendarinner}` : `${stylecalendar.open} ${stylecalendar.stylecalendarinner}`}>
            <FullCalendar
              plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
              initialView='dayGridMonth'
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
              }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: "0:00",
                endTime: "24:00",
              }}
              weekends={true} // 週末表示
              events={myEvent}
              dateClick={entryClick}
              eventClick={eventClick}
            />
          </div>
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