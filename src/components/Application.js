import React, { useState, useEffect } from "react";

import "components/Application.scss";
import Button from "components/Button";
import DayListItem from 'components/DayListItem'
import DayList from 'components/DayList'
import Appointment from 'components/Appointment'
import axios from 'axios'


const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Peter Lemanski",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Caitlyn MacG",
      interviewer: {
        id: 2,
        name: "Devin MacGillivray",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  },
  {
    id: 4,
    time: "3pm",
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 3,
        name: "Ben Mussche",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  }

];

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    axios.get('/api/days')
      .then(response => setDays([...response.data]))
  }, [])

  const appointmentList = appointments.map(appointment => {
    return (
      <Appointment
        key={appointment.id}

        //this is spread is awesome
        {...appointment}
      />
    );
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment id='last' time='5pm' />
      </section>
    </main>
  );
}
