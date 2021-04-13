import React, { useState } from 'react'
import 'components/InterviewerList.scss'
import InterviewerListItem from 'components/InterviewerListItem'

export default function InterviewerList(props) {

  const interviewerList = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        avatar={interviewer.avatar}
        name={interviewer.name}
        setInterviewer={props.setInterviewer}
        selected={interviewer.id === props.interviewer}
      />
    )
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerList}
      </ul>
    </section>
  );
}