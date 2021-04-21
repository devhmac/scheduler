export function getAppointmentsForDay(state, daySelector) {
  for (let day of state.days) {
    if (day.name === daySelector) {
      return day.appointments.map(id => state.appointments[id]);
    }
  };
  return [];
};

export function getInterview(state, interview) {
  if (interview === null) return null;

  let interviewerScheduled = {}
  for (let key in state.interviewers) {
    if (state.interviewers[key].id === interview.interviewer)
      interviewerScheduled = state.interviewers[key]
  }
  const interviewObj = {
    student: interview.student,
    interviewer: interviewerScheduled
  };

  return interviewObj
}

export function getInterviewersForDay(state, daySelector) {
  for (let day of state.days) {
    if (day.name === daySelector) {
      return day.interviewers.map(id => state.interviewers[id]);
    }
  };
  return [];
};
