import Appointment from "components/Appointment"

export function getAppointmentsForDay(state, daySelector) {

  const dayMatchArray = [];

  for (let day of state.days) {
    if (day.name === daySelector) {
      for (let appointment in state.appointments) {
        if (day.appointments.includes(Number(appointment))) {
          dayMatchArray.push(state.appointments[appointment]);
        }
      }
    }
  };
  return dayMatchArray;
};

