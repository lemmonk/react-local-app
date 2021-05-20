import React, { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import  UserContext  from './UserContext';
import Loading from './Loading';
import ChatCard from './ChatCard';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import socketIOClient from "socket.io-client";

import { withStyles } from '@material-ui/core/styles';
const ChatTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#282828',
    },
   
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: '#45bdfe',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1eabf7',
      },
    },
  },
})(TextField);


function Chat(props) {
  const API = 'http://localhost:8080'; // <--- TEMP

  const [socketConn, setSocket] = useState(null);

  const {user} = useContext(UserContext);
  const history = useHistory();

  const [input, setInput] = useState({
    message: ''
  });

  const [chatRoom, setChatRoom] = useState({
    host_key: props.location.state.detail.host_key,
    user_key: props.location.state.detail.user_key,
  })
  const [messages, setMessages] = useState(null);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    window.scrollTo(0, 0);
   
    if(!chatRoom.host_key || !chatRoom.user_key || !user)
    return history.push('/'),[history];
   
    const input = {
      host_key: chatRoom.host_key,
      user_key: chatRoom.user_key,
    }
  

    axios.post('/api/chat', { input })
    .then(res => {
    //  console.log(res.data);
     setMessages(res.data);
     createSocketConn();
    })
    .catch(err => {
      console.log(err);
    });
  

  },[refresh]);


  const sendMessage = () => {

    if(!chatRoom.host_key || !chatRoom.user_key || !user)
    return history.push('/'),[history];

    if(input.message.length > 1000){
     return alert("Max message length exceeded (1000 char. limit)");
    }
    
    
    const msg = {
      host_key: chatRoom.host_key,
      user_key: chatRoom.user_key,
      name: `${user.first_name} ${user.last_name}`,
      message: input.message,
    }

    setInput({
      message: '',
    })

    axios.patch('/api/chat', { msg })
    .then(res => {
    //  console.log(res.data[0]);
    sendSocketMessage([res.data.host_key, res.data.user_key]);
    
    })
    .catch(err => {
      console.log(err);
    });
  }

  
  const triggerUseEffect = () => {
    if (refresh){
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  const createSocketConn = () => {
  
    const socket = socketIOClient(API);
    setSocket(socket);

    socket.on("message", msg => {

      if(user.public_key === msg[0] || user.public_key === msg[1]){
       
        triggerUseEffect();
      } 

  });
  }




  const sendSocketMessage = msg => {
  
    if(window.location.hostname !== 'localhost'){
      return;
    }
  
      let socket = socketConn; 
      
      if (!socket){
      
      socket = socketIOClient(API);
      setSocket(socket);
      socket.emit('input', msg);
      } else {
      socket.emit('input', msg);
     
      } 
      
    }
  
  const chatCard = messages ? messages.map((msg, index) => {
  
    const style = msg.name === `${user.first_name} ${user.last_name}` ? 'chat-card-wrapper' : 'chat-card-wrapper-other';
    

    return (
      <ChatCard
      key={index}
      index={msg.id}
      style={style}
      stamp={msg.stamp.substring(0,10)}
      name={msg.name}
      msg={msg.message}
      />
    )}
    ) : null;


 
  return (

<section >

{chatCard ? chatCard : <Loading/>}
<div className='divider'></div>

<div className='chat-input-wrapper'>
  <div className='chat-input-double-wrap'>

  
<form className='chat-input-inner'>

<ChatTextField
          id="outlined-multiline-static"
          fullWidth
          label="New Message"
          multiline
          rows={3}
          variant="outlined"
         
          value={input.message ? input.message : ''}
        onChange={(event) => setInput((prev) => ({
          ...prev,
          message: event.target.value
        }))}
      
        />
        <div className='chat-send-icon'>
        <SendIcon onClick={() => sendMessage()} />
        </div>
      
</form>
</div>
</div>
</section>

  );
}

export default Chat;
