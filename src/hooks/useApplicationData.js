import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData(props) {

  const initial = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  }

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const newSpotDayObj = (id, days, appointments) => {
    const dayToUpdate = days.find(day => day.appointments.includes(id));

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

  //--- useReducer state ------//

  const [state, dispatch] = useReducer(reducer, initial);


  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }

      case SET_APPLICATION_DATA:
        return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }

      case SET_INTERVIEW: {

        //building new appointments state
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview,
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment,
        };

        //builds new days state
        const days = newDaysArr(newSpotDayObj(action.id, state.days, appointments), state.days)

        return { ...state, appointments, days }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  useEffect(() => {
    const cleanup = () => {
      webSocket.close()
    }
    const webSocket = new WebSocket('ws://localhost:8001')
    webSocket.onopen = () => {
      webSocket.onmessage = (event) => {

        const message = JSON.parse(event.data)
        if (message.type === "SET_INTERVIEW") {
          dispatch({ type: SET_INTERVIEW, id: message.id, interview: message.interview })
        }
      }
    }
    return cleanup
  }, [])
  // const setDay = (day) => setState({ ...state, day });

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });
  // const setDays = (days) => setState((prev) => ({ ...prev, days }));
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const [daysList, appointmentsList, interviewersList] = all;

      dispatch({
        type: SET_APPLICATION_DATA,
        days: daysList.data,
        appointments: appointmentsList.data,
        interviewers: interviewersList.data
      });
    });
  }, []);


  //sends adds booked data to state and sends to database API
  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() =>
        dispatch({ type: SET_INTERVIEW, id: id, interview: interview })
      );
  }

  //sends canceled interview data to server api
  function cancelInterview(id) {

    return axios.delete(`/api/appointments/${id}`, { interview: null })
      .then(() => dispatch({ type: SET_INTERVIEW, id: id, interview: null }));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
