import React, { useState, useEffect } from "react";

import "components/Application.scss";
import Button from "components/Button";
import DayListItem from 'components/DayListItem'
import DayList from 'components/DayList'
import Appointment from 'components/Appointment'
import { getAppointmentsForDay, getInterview } from 'helpers/selectors'
import axios from 'axios'


export default function Application(props) {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(all => {
        const [daysList, appointmentsList, interviewersList] = all
        console.log(daysList.data)
        setState(prev => ({ ...prev, days: daysList.data, appointments: appointmentsList.data, interviewers: interviewersList.data }))
      })
  }, []);


  const dailyAppointments = getAppointmentsForDay(state, state.day)

  const appointmentList = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}

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
