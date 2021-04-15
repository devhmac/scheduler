export default function getAppointmentsForDay(state, daySelector) {
  for (let day of state.days) {
    if (day.name === daySelector) {
      return day.appointments.map(id => state.appointments[id]);
    }
  };
  return [];
};

