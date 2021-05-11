
function ChatCard(props) {

  return (
    <section className={props.style}>

   <div className={'chat-card-inner'}>

      <div className='chat-name'>{props.name}</div>

      <div className='chat-msg'>{props.msg}</div>

      <div className='chat-stamp'>{props.stamp}</div>

   </div>
     
     
    </section>
  );
}

export default ChatCard;
