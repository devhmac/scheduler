import React, {useEffect} from 'react'
import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Empty from 'components/Appointment/Empty'
import Show from 'components/Appointment/Show'
import Form from 'components/Appointment/Form'
import useVisualMode from '../../hooks/useVisualMode'
import Status from 'components/Appointment/Status'
import Confirm from 'components/Appointment/Confirm'
import Error from 'components/Appointment/Error'


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
  
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);
  
  
  return(
  <article className='appointment' data-testid="appointment"> 
    <Header 
      time={props.time}
       />
     {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview &&(
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