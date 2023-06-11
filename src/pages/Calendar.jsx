import React, { useEffect, useState } from "react";
import { db, app } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Calendar.css";

const Calendar = () => {
  const [data, setData] = useState();
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDate, setEventDate] = useState("");
  const getData = () => {
    getDocs(collection(db, "calendar")).then((query) => {
      if (!query.empty) {
        const docs_data = [];
        query.forEach((doc) => {
          const doc_data = doc.data();
          doc_data.id = doc.id;
          docs_data.push(doc_data);
        });
        setData(docs_data);
      }
    });
  };
  const addData = (item) => {
    addDoc(collection(db, "calendar"), item).then((msg) => {
      setEventName("");
      setEventDescription("");
      setEventDate("");
      setEventTime("");
      alert("Successful added calendar");
      getData();
    });
  };
  const removeData = (id) => {
    deleteDoc(doc(db, "calendar", id.toString())).then((msg) => {
      setData([]);
      alert("Remove data successfully");
      getData();
    });
  };
  useEffect(() => {
    getData();
  }, []);
  const stringToDate = (str, time) => {
    const arr = str.split("-");
    const arr1 = time.split(":");
    const date = new Date();
    date.setFullYear(parseInt(arr[0]));
    date.setMonth(parseInt(arr[1]) - 1);
    date.setDate(parseInt(arr[2]));
    date.setHours(parseInt(arr1[0]));
    date.setMinutes(parseInt(arr1[1]));
    return date;
  };

  const [date, setDate] = useState(new Date());
  const [days, setDays] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [cCalendar, setCCalendar] = useState(new Date());

  const renderCalendar = () => {
    date.setDate(1);

    const monthDays = days;

    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    const prevLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const f1 = () => {
      const eop = [];
      for (let x = firstDayIndex; x > 0; x--) {
        if (
          data?.find(
            (item) =>
              new Date(item.time.seconds * 1000).getDate() ==
              prevLastDay - x + 1
          )
        ) {
          eop.push(
            <div
              class="prev-date"
              //   onClick={() => {
              //     for (let item of data) {
              //       const d_date = new Date(item.time.seconds * 1000);
              //       if (d_date.getDate() == prevLastDay - x + 1) {
              //         setCCalendar(d_date);
              //       }
              //     }
              //   }}
            >
              {prevLastDay - x + 1}
            </div>
          );
        } else {
          eop.push(<div class="prev-date">{prevLastDay - x + 1}</div>);
        }
      }
      for (let i = 1; i <= lastDay; i++) {
        if (
          i === new Date().getDate() &&
          date.getMonth() === new Date().getMonth()
        ) {
          eop.push(<div class="today">{i}</div>);
        } else {
          if (
            data?.find((item) => {
              const d_date = new Date(item.time.seconds * 1000);
              return (
                d_date.getDate() == i &&
                d_date.getMonth() == date.getMonth() &&
                d_date.getFullYear() == date.getFullYear()
              );
            })
          ) {
            eop.push(
              <div
                onClick={() => {
                  for (let item of data) {
                    const d_date = new Date(item.time.seconds * 1000);
                    if (
                      d_date.getDate() == i &&
                      d_date.getMonth() == date.getMonth() &&
                      d_date.getFullYear() == date.getFullYear()
                    ) {
                      setCCalendar(d_date);
                    }
                  }
                }}
              >
                *{i}
              </div>
            );
          } else {
            eop.push(
              <div
                onClick={() => {
                  const d_date = new Date();
                  d_date.setDate(i);
                  d_date.setMonth(date.getMonth());
                  d_date.setFullYear(date.getFullYear());
                  setCCalendar(d_date);
                }}
              >
                {i}
              </div>
            );
          }
        }
      }
      for (let j = 1; j <= nextDays; j++) {
        if (
          data?.find(
            (item) => new Date(item.time.seconds * 1000).getDate() == j
          )
        ) {
          eop.push(
            <div
              class="next-date"
              //   onClick={() => {
              //     for (let item of data) {
              //         const d_date = new Date(item.time.seconds * 1000);
              //         if (d_date.getDate() == j) {
              //             d_date.setMonth(d_date.getMonth()+1);
              //           setCCalendar(d_date);
              //         }
              //       }
              //   }}
            >
              {j}
            </div>
          );
        } else {
          eop.push(<div class="next-date">{j}</div>);
        }
      }
      return <div class="days">{eop}</div>;
    };

    return <>{f1()}</>;
  };

  return (
    <div className="container">
      <div class="calendar">
        <div class="month">
          <i
            class="fas fa-angle-left prev"
            onClick={() => {
              const d_date = new Date(date.getTime());
              d_date.setMonth(d_date.getMonth() - 1);
              setDate(d_date);
            }}
          ></i>
          <div class="date">
            <h1>{months[date.getMonth()]}</h1>
            <p>{date.getFullYear().toString()}</p>
          </div>
          <i
            class="fas fa-angle-right next"
            onClick={() => {
              const d_date = new Date(date.getTime());
              if (d_date.getMonth() == 11) {
                let current = new Date(date.getFullYear() + 1, 0, 1);
                setDate(current);
              } else {
                let current = new Date(
                  d_date.getFullYear(),
                  d_date.getMonth() + 1,
                  1
                );
                setDate(current);
              }
            }}
          ></i>
        </div>
        <div class="weekdays">
          <div style={{ color: "red" }}>Sun</div>
          <div style={{ color: "yellow" }}>Mon</div>
          <div style={{ color: "pink" }}>Tue</div>
          <div style={{ color: "green" }}>Wed</div>
          <div style={{ color: "orange" }}>Thu</div>
          <div style={{ color: "blue" }}>Fri</div>
          <div style={{ color: "purple" }}>Sat</div>
        </div>
        {renderCalendar()}
      </div>
      <div class="event">
        <form
          name="myForm"
          id="form"
          onSubmit={(e) => {
            e.preventDefault();
            const add_data = {
              name: eventName,
              description: eventDescription,
              time: stringToDate(eventDate, eventTime),
            };
            addData(add_data);
          }}
        >
          <div class="row">
            <div class="col-20">
              <label for="ename">Title Event</label>
            </div>
            <div class="col-80">
              <input
                type="text"
                id="ename"
                name="eventName"
                value={eventName}
                onChange={(e) => {
                  setEventName(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="row">
            <div class="col-20">
              <label for="Date">Date</label>
            </div>
            <div class="col-80">
              <input
                type="date"
                id="date"
                name="Date"
                value={eventDate}
                onChange={(e) => {
                  setEventDate(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="row">
            <div class="col-20">
              <label for="time">time</label>
            </div>
            <div class="col-80">
              <input
                type="time"
                id="time"
                name="time"
                value={eventTime}
                onChange={(e) => {
                  setEventTime(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="row">
            <div class="col-20">
              <label>Description</label>
            </div>
            <div class="col-80">
              <input
                type="text"
                id="dname"
                name="dname"
                value={eventDescription}
                onChange={(e) => {
                  setEventDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <input type="submit" value="Submit" id="submit" />
          </div>
        </form>
        <div style={{ color: "black" }} class="showEvent">
          <div>
            {cCalendar.toDateString()}
            <h3 id="result">
              {data
                ?.filter((item) => {
                  console.log(new Date(item.time.seconds * 1000).getDate());
                  console.log(cCalendar.getDate());
                  return (
                    new Date(item.time.seconds * 1000).getDate() ==
                    cCalendar.getDate()
                  );
                })
                ?.map((item) => (
                  <Card
                    removeData={removeData}
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    time={item.time}
                  />
                ))}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ name, description, time, id, removeData }) => {
  return (
    <div>
      <div>{id}</div>
      {name}
      <div>{description}</div>
      <div>{time?.seconds && new Date(time.seconds * 1000).toISOString()}</div>
      <button
        onClick={() => {
          removeData(id);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Calendar;
