import DeleteIcon from '@material-ui/icons/Delete';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import {useHistory} from 'react-router-dom';

function InboxCard(props) {

const history = useHistory();

const openChat = f_keys => {
  return history.push({
    pathname: '/chat',
    state: { detail: f_keys }
  }),[history];
}


  return (
    <section className={props.style}>

    <div className='inbox-card-inner'>

    <div className='inbox-left'>
    <img src={props.image ? `/images/${props.image}` : '/images/user.png'} alt='img' />
    
    </div>

    <div className='inbox-center'>
    
    <p className='inbox-status'>{props.status ? props.status :  '...'}</p>
    <p>{props.name ?  props.name :  '...'}</p>
    <p>{props.city ? props.city :  '...'}</p>
    <p>{props.date ? ` ${props.date}` :  '...'}</p>
   
    
    </div>
   

    <div className='inbox-right'>
    
    <p>{props.start ? `From: ${props.start}` :  '...'}</p>
    <p>{props.end ? `To: ${props.end}` :  '...'}</p>
    </div>
    
    </div>
  
    <div className='inbox-icons'>
      <ChatBubbleIcon
      className='inbox-icon-msg'
      onClick={() => openChat(props.f_keys)}
      />
      < DeleteIcon className='inbox-icon-delete'
      onClick={() => props.open(props.id)}
    /></div>
     
     
    </section>
  );
}

export default InboxCard;
