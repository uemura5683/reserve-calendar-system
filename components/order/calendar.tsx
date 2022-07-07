import axios from "axios"
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

import { useRouter } from "next/router";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { INITIAL_EVENTS } from "../../utils/event-utils";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import stylecalendar from '../../styles/Calendar.module.css'
import styled from "@emotion/styled";

export const StyleWrapper = styled.div`
  .fc {
    height: 100vh;
  }
  .fc .fc-col-header-cell-cushion,
  .fc .fc-daygrid-day-number {
    font-size: 12px;
  }
  @media only screen and (max-width: 480px) {
    .fc .fc-col-header-cell-cushion,
    .fc .fc-daygrid-day-number {
      font-size: 10px;
    }
  }    
`

const Calendar = (user:any) => {
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

  // Weekly Monthly トグル
  const [initial, setinitial] = useState(true);
  const toggle = () => setinitial(!initial)
  const initialViewString:any = initial ? 'timeGridWeek' : 'dayGridMonth';


  const [modalIsOpen,setIsOpen] = useState(false);

  // エントリー
  const entryClick = () => {
    if( user.data ) {
      const modalIsOpen = true;
      ReactDOM.render(
        <React.StrictMode>
          <OrderConfirm isOpen={modalIsOpen} />
        </React.StrictMode>,
        document.getElementById("modalArea")
      );
    } else {
      alert('ログインしてください');
      router.push("/customer/login"); // ログインページへ遷移させる
    }
  }

  function OrderConfirm(props:any) {
    function closeModal(){

    }
    return(
      <>
        { props.isOpen == true ? (
            <>
              <div className={stylecalendar.calendarmodal}>
                エントリーします。
                <button onClick={closeModal}>close</button>
              </div>
              <div className={stylecalendar.calendarmodalbg} onClick={closeModal}></div>
            </>
          ) : null
        }
      </>
    )  
  }


  // 詳細を表示
  const eventClick = (e:any) => {

  }

  return (
    <>
      <div id="modalArea"></div>
      <div className={stylecalendar.togglemenu}>
        <button onClick={toggle} className={initial ? `${stylecalendar.open}` : `${stylecalendar.hidden}`}>Weekly</button>
        <button onClick={toggle} className={initial ? `${stylecalendar.hidden}` : `${stylecalendar.open}`}>Monthly</button>
      </div>
      <div className={`${stylecalendar.stylecalendar} ${stylecalendar.hiddenphone}`}>
        <div
          className={initial
            ? `${stylecalendar.open} ${stylecalendar.stylecalendarinner}`
            : `${stylecalendar.hidden} ${stylecalendar.stylecalendarinner}`}
        >
          <StyleWrapper>
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
            buttonText= {{
              prev:     '<',
              next:     '>',
              prevYear: '<<',
              nextYear: '>>',
              today:    '今日',
              month:    '月',
              week:     '週',
              day:      '日',
              list:     '一覧'
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
          </StyleWrapper>
        </div>
        <div
          className={initial
            ? `${stylecalendar.hidden} ${stylecalendar.stylecalendarinner}`
            : `${stylecalendar.open} ${stylecalendar.stylecalendarinner}`}
        >
          <StyleWrapper>  
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
            buttonText= {{
              prev:     '<',
              next:     '>',
              prevYear: '<<',
              nextYear: '>>',
              today:    '今日',
              month:    '月',
              week:     '週',
              day:      '日',
              list:     '一覧'
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
          </StyleWrapper>
        </div>
      </div>
    </>
  )
}


export default Calendar;