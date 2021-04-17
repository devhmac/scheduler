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

  const newSpotCount = (appId, add) => {
    for (let day of state.days) {
      if (day.appointments.includes(appId)) {
        let newSpots = day.spots;
        add ? newSpots += 1 : newSpots -= 1
        return { ...day, spots: newSpots }
      }
    }
  }
  const newDaysArr = (dayObj, daysArr) => {

    return daysArr.map((day) => day.name === dayObj.name ? dayObj : day);
    // console.log('the map!!!!!', daysArr.map((day) => day.name === dayObj.name ? dayObj : day))

  }

  const testDay = newSpotCount(1)
  console.log('my days', testDay)
  console.log('state days', state.days)

  newDaysArr(testDay, state.days)



  // const newSpotCount2 = (id, add) => {
  //   for (let i = 0; i < state.days.length - 1; i++) {
  //     if (state.days[i].appointments.includes(id)) {
  //       let newSpots = state.days[i].spots
  //       add ? newSpots += 1 : newSpots -= 1
  //       return [state.days[i] = { ...state.days[i], spots: newSpots }]
  //     }
  //   }
  // }

  // const getSpotsForDay = (day, appointments) => {
  //   const spots = 0

  //   return spots
  // }

  // const updateSpots = (dayName, days, appointments) => {

  //   //find day obj
  //   //calc spots
  //   //create new day obj

  // }





  //console.log(state.days[0])


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


    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => setState({ ...state, appointments, }))
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