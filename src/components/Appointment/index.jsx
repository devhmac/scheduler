import React from 'react'
import 'components/Appointment/styles.scss'
import Header from './Header'
import Empty from './Empty'
import Show from './Show'
import Form from './Form'
import useVisualMode from '../../hooks/useVisualMode'
import Status from './Status'
import Confirm from './Confirm'
import Error from './Error'


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE"
const SAVING = "SAVING"
const ERROR_SAVE = "ERROR_SAVE"
const DELETING = "DELETING"
const ERROR_DELETE = "ERROR_DELETE"
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
    .catch(() => transition(ERROR_SAVE, true))
 };

 
 function deleteInterview(id){
   transition(DELETING, true)
   
   props.cancelInterview(id)
   .then(()=>transition(EMPTY))
   .catch(()=>transition(ERROR_DELETE, true))
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

    {mode === EDIT && (
    <Form 
    name={props.interview.student} 
    interviewer={props.interview.interviewer.id} 
    interviewers={props.interviewers} 
    onSave={save} 
    onCancel={back} 
    />
    )}

    {mode === ERROR_SAVE && (<Error message={'We were unable to schedule your appointment'} onClose={back} />)}
    {mode === ERROR_DELETE && (<Error message={'We were unable to delete your appointment'} onClose={back} />)}

    </article>
  );
};