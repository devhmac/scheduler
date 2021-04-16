import React from 'react'
import 'components/Appointment/styles.scss'
import Header from './Header'
import Empty from './Empty'
import Show from './Show'
import Form from './Form'
import useVisualMode from '../../hooks/useVisualMode'
import Status from './Status'
import Confirm from './Confirm'
import { fireEvent } from '@testing-library/react/dist'


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
const CREATE = "CREATE"
const SAVING = "SAVING"
const DELETING = "DELETING"
const CONFIRM = "CONFIRM"
const EDIT = "EDIT"

export default function Appointment(props) {
const {mode, transition, back} = useVisualMode(
  props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id,interview)
    .then(()=> transition(SHOW))
 };

 function editInterview(){
   transition(EDIT)
   console.log('should be the same as', props.interview.interviewer.id, props.interview.student)
 }
 
 function deleteInterview(id){
   transition(DELETING)
   
   props.cancelInterview(id)
   .then(()=>transition(EMPTY))
  };
  
  function confirmDelete(){
    transition(CONFIRM)
  };

  

  return(
  <article className='appointment'>
    <Header 
      time={props.time}
       />
     {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
    <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      onDelete={confirmDelete}
      onEdit={()=>{transition(EDIT)}}
    />
    )}
    {mode === CREATE && (
     <Form interviewers={props.interviewers} onSave={save} onCancel={back} />
    )}
    {mode === SAVING && (<Status message={"Saving"}/>)}
    {mode === DELETING && (<Status message={'Deleting'} />)}
    {mode === CONFIRM && (<Confirm message={"Are you sure you would like to delete"} onCancel={back} onConfirm={()=> deleteInterview(props.id)} />)}
    {mode === EDIT && (<Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onSave={save} onCancel={back} />)}

    </article>
  );
};