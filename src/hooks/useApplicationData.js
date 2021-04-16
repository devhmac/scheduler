import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function useApplicationData(props) {

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

        setState(prev => ({ ...prev, days: daysList.data, appointments: appointmentsList.data, interviewers: interviewersList.data }))
      })
  }, []);

  const findDayId = (id) => {
    for (let day of state.days) {
      if (day.appointments.includes(id)) {
        return day.id
      }
    }
  }


  //sends adds booked data to state and sends to database API
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    let dayId = findDayId(id)
    const day = {

    }

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => setState({ ...state, appointments }))
  }

  //sends canceled interview data to server api
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`, { interview: null })
      .then(() => setState({ ...state, appointments }))

  };



  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}