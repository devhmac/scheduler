import React from 'react'
import 'components/Appointment/styles.scss'
import Header from './Header'
import Empty from './Empty'
import Show from './Show'
import useVisualMode from '../../hooks/useVisualMode'


// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Caitlyn MacG",
//       interviewer: {
//         id: 2,
//         name: "Devin MacGillivray",
//         avatar: "https://i.imgur.com/twYrpay.jpg",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "12pm",
//   },
//   {
//     id: 4,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 3,
//         name: "Ben Mussche",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   }
// ];

const EMPTY = "EMPTY";
const SHOW = "SHOW";

export default function Appointment(props) {
const {mode, transition, back} = useVisualMode(
  props.interview ? SHOW : EMPTY
  );

  return(
    <article className='appointment'>
      <Header 
      time={props.time}
       />
       {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} 

    </article>
  );
};