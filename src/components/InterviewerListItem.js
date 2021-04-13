import React from 'react'
import 'components/InterviewerListItem.scss'

export default function InterviewerListItem(props) {

  const liClassNames = props.selected ? "interviewers__item--selected" : 'interviewers__item';

  return (<li className={liClassNames} onClick={props.setInterviewer}>
    <img
      // key={props.id}
      className="interviewers__item-image"
      src={props.avatar}
      alt={props.name}
    />
    {props.selected ? props.name : ''}
  </li>)

}