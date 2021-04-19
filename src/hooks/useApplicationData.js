import React, { useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });
  const setDays = (days) => setState((prev) => ({ ...prev, days }));

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const [daysList, appointmentsList, interviewersList] = all;

      setState((prev) => ({
        ...prev,
        days: daysList.data,
        appointments: appointmentsList.data,
        interviewers: interviewersList.data,
      }));
    });
  }, []);

  const newSpotDayObj = (dayName, days, appointments) => {
    const dayToUpdate = days.find(day => day.name === dayName);
    let spotCount = 0;
    for (let app in appointments) {
      if (appointments[app].interview === null && dayToUpdate.appointments.includes(appointments[app].id)) {
        spotCount++
      }
    }
    return { ...dayToUpdate, spots: spotCount };
  };



  const newDaysArr = (dayObj, daysArr) => {
    return daysArr.map((day) => (day.name === dayObj.name ? dayObj : day));
  };

  //sends adds booked data to state and sends to database API
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = newDaysArr(newSpotDayObj(state.day, state.days, appointments), state.days)

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() =>
        setState((prev) => {
          return { ...prev, appointments, days };
        })
      );
  }

  //sends canceled interview data to server api
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = newDaysArr(newSpotDayObj(state.day, state.days, appointments), state.days)

    return axios
      .delete(`/api/appointments/${id}`, { interview: null })
      .then(() =>
        setState((prev) => {
          return { ...prev, appointments, days };
        })
      );
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
