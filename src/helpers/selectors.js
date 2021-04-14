
export function getAppointmentsForDay(state, day) {

  const dayMatchArray = []

  for (let day of state) {
    if (day.name === day) {
      console.log(day.appointment)
    }
  }

  return dayMatchArray;
};

