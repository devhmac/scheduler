import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "../reducers/reducer";

export default function useApplicationData(props) {


  //--- useReducer state ------//

  const initial = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  }

  const [state, dispatch] = useReducer(reducer, initial);


  useEffect(() => {
    const cleanup = () => {
      webSocket.close()
    }
    const webSocket = new WebSocket('wss://react-schedule-me.herokuapp.com/')
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
