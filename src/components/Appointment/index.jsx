import React from 'react'
import 'components/Appointment/styles.scss'
import Header from './Header'
import Empty from './Empty'
import Show from './Show'

export default function Appointment(props) {
  console.log(props)
  return(
    <article className='appointment'>
      <Header 
      time={props.time}
       />
       {props.interview ?<Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} 

    </article>
  );
};