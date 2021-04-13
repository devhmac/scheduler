import React from 'react'
import 'components/InterviewerList.scss'

export default function InterviewerList(props) {

  // const dayArr = props.days.map(day => {
  //   return (<DayListItem
  //     key={day.id}
  //     name={day.name}
  //     spots={day.spots}
  //     selected={day.name === props.day}
  //     setDay={props.setDay} />)
  // });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list"></ul>
    </section>
  );
}