import React, { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom';
import useReference from '../hooks/useReference';
import axios from 'axios';
import UserContext  from './UserContext';
import SocketContext  from './SocketContext';
import Loading from './Loading';
import ChatCard from './ChatCard';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import socketIOClient from "socket.io-client";
import IsValidDomain from 'is-valid-domain';
import globals from '../globals';
import NavBar from './NavBar';

import socketConn from '../helpers/socket';

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
  // console.log = function() {};
  

  const API = `${globals().socket}`; 

  const [loading, setLoading] = useState(true);
  
  const {user} = useContext(UserContext);
  const {socket, setSocket} = useContext(SocketContext);

  const history = useHistory();

  const [input, setInput] = useState({
    message: '',
  });

  const [chatRoom] = useState({
    host_key: props.location.state.detail.host_key,
    user_key: props.location.state.detail.user_key,
  })
  const [messages, setMessages] = useState(null);
  const [refresh, setRefresh] = useState(false);

 

const mounted = useReference();
  useEffect(() => {
    window.scrollTo(0, 0);
     if(!mounted)return;
   
    if(!chatRoom.host_key || !chatRoom.user_key || !user)
    return history.push('/'),[history];
   
    const input = {
      host_key: chatRoom.host_key,
      user_key: chatRoom.user_key,
    }
  
  
    axios.post('/api/chat', { input })
    .then(res => {
   
     setLoading(false);
     setSending(false);
     setMessages(res.data);
    
   
    if (!socket){
      // create socket connection if one does not exist
      const tempConn = socketConn();
      setSocket(tempConn);
      localSocketConn(tempConn);
    } else {
      localSocketConn(socket);
    }
   

    })
    .catch(err => {
     console.log(err);
      return history.push('/'),[history];
    });
  

  },[refresh]);


  const containsLink = msg => {
    let result = false;
    let words = msg.split(' ');

    for (const word of words){
   
    //validates weather a word is a hyperlink
    try {

      let url = new URL(word);
      result = true;
    } catch (err) {

      if(IsValidDomain(word) || word.substring(0,4).toLowerCase() === 'www.'){
        result = true;
      } 
    
    }
  }
  return result;
  }


  const sendMessage = () => {

    if(!mounted)return;

    if(!chatRoom.host_key || !chatRoom.user_key || !user)
    return history.push('/'),[history];

    if(input.message.length < 1)return;

    if(input.message.length > 1000){

     return alert("Max message length exceeded (1000 char. limit)");
    }
    
    const has_link = containsLink(input.message);
     
    const msg = {
      host_key: chatRoom.host_key,
      user_key: chatRoom.user_key,
      name: `${user.first_name} ${user.last_name}`,
      message: input.message,
      has_link: has_link
    }

    setInput({
      message: '',
    })

  
    axios.patch('/api/chat', { msg })
    .then(res => {
   
    const sender = `${user.first_name} ${user.last_name}`;
    const reciever = user.public_key === res.data.host_key ? res.data.user_key : res.data.host_key;
   
    sendSocketMessage([res.data.host_key, res.data.user_key, sender, reciever]);
    
    })
    .catch(err => {
   
    alert('Message failed to send.')
    setSending(false);
    setLoading(false);
    });
  }

  
 
//live update
  const localSocketConn = socket => {
  
    socket.on("message", msg => {
     
      if(user.public_key === msg[0] || user.public_key === msg[1]){
       
        triggerUseEffect();

      } 
  });
  }


  const triggerUseEffect = () => {
    
    if(!mounted)return;

    if (refresh){
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }




//send socket message
 const [sending, setSending] = useState(null);
 const [temp, setTemp] = useState({
        id: null,
        name: null,
        message: null,
        has_link: false,
        stamp: null
 })



  const sendSocketMessage = msg => {
  
    setTemp({
        id: 0,
        name: `${user.first_name} ${user.last_name}`,
        message: input.message,
        has_link: true,
        stamp: 'just now'
    })

      setSending(true);

      if (!socket){
      const tempConn = socketConn(); 
      setSocket(tempConn);
      socket.emit('input', msg);
      } else {
      socket.emit('input', msg);
     
      } 
      
    }


    const socketDisconnect = () => {
    
      if (socket){
      socket.disconnect('disconnect');
      }  
    }

    
    const mapWords = msg => {

      let words = msg.split(' ');

      const wordMap = words.map((word, index) => {

      let url;
      

      //validates weather a word is a hyperlink
      try {

        url = new URL(word);
        word = <a href={url.href} target='_blank' rel="noreferrer">{url.href}</a>
      } catch (err) {

        if(IsValidDomain(word) || word.substring(0,4).toLowerCase() === 'www.'){
          word = <a href={`https://${word}`} target='_blank' rel="noreferrer">{word}</a>
        
        } else {
          word = ` ${word} `
        }
      
      }

        return (
          <div className='inline-msg'
          key={index}   
          >
          {word}
          </div>
        )
      })

      return wordMap;
    }


 
    const chatCard = messages ? messages.map((msg, index) => {
  
    const style = msg.name === `${user.first_name} ${user.last_name}` ? 'chat-card-wrapper' : 'chat-card-wrapper-other';
  
    let linked = null;
    if (msg.has_link){
       linked = mapWords(msg.message); 
    }

 
    return (
      <ChatCard
      key={index}
      index={msg.id}
      style={style}
      stamp={msg.stamp.substring(0,10)}
      name={msg.name}
      msg={linked ? linked : msg.message}
      />
    )}
    ) : null;


  const tempCard =  <ChatCard
  
      index={temp.id}
      style={'chat-card-wrapper'}
      stamp={temp.stamp}
      name={temp.name}
      msg={temp.message}
      />;

 
  return (

<section className='chat-wrapper' >
    <NavBar
          
    logo={false}
    title={null}
    nav={false}
    action='/inbox'
    // extra={socketDisconnect}
  /> 

{loading ? <Loading/> : null}
{sending ? tempCard : null}
{chatCard ? chatCard : null}

<div className='divider'></div>

<div className='chat-input-wrapper'>
  <div className='chat-input-double-wrap'>

  
<form className='chat-input-inner'>
<div className='chat-send-icon'>
        <SendIcon onClick={() => sendMessage()} 
       
        />
        </div>
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
       
      
</form>
</div>
</div>
</section>

  );
}

export default Chat;
