import React from 'react'
import 'components/InterviewerListItem.scss'

export default function InterviewerListItem(props) {

  const liClassNames = props.selected ? "interviewers__item--selected" : 'interviewers__item';

  return (<li className={liClassNames}>
    <img
      key={props.id}
      className="interviewers__item-image"
      src={props.avatar}
      selected={props.selected}
      onClick={() => { props.setInterviewer(props.name) }}
      alt="Sylvia Palmer"
    />
    {props.selected ? props.name : ''};
  </li>)

}