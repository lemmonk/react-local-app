import DeleteIcon from '@material-ui/icons/Delete';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import globals from '../globals';
import {useHistory} from 'react-router-dom';

function InboxCard(props) {
  

const history = useHistory();

const openChat = f_keys => {
  return history.push({
    pathname: '/chat',
    state: { detail: f_keys }
  }),[history];
}

const openInfo = f_keys => {

  return history.push({
    pathname: '/info',
    state: { detail: f_keys }
  }),[history];
}

  return (
    <section className={props.style}>

<div className='inbox-icons'>
    <div>
      <AccountCircleIcon
      className='inbox-icon-msg'
      onClick={() => openInfo(props.f_keys)}
      />
      <ChatBubbleIcon
      className='inbox-icon-msg'
      onClick={() => openChat(props.f_keys)}
      />
    </div>

    </div>

    <div className='inbox-card-inner'>


    
   

    <div className='inbox-center'>
    <p className='inbox-type'>{props.type ? props.type :  '...'}</p>
    <p className={props.status_style}>Status: {props.status ? <label>{props.status}</label> :  '...'}</p>
    <p>Host: {props.host_name ?  props.host_name :  '...'}</p>
    <p>Guest: {props.user_name ?  props.user_name :  '...'}</p>
    <p>In: {props.city ? props.city :  '...'}</p>
    <p>{props.date ? `${props.date} @ ${props.start} - ${props.end}` :  '...'}</p>

  
   
    </div>
    </div>
   
   <div className='inbox-icons'>
   <div>
    {props.status !== 'Cancelled' ? 
        < DeleteIcon className='inbox-icon-delete'
          onClick={() => props.open(props.other)}/>
          : null }
    </div>
   </div>
    
     
     
    </section>
  );
}

export default InboxCard;
