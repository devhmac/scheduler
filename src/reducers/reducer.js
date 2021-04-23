
export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

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


export default function reducer(state, action) {
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