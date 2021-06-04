import { useState } from 'react';
import socketIOClient from "socket.io-client";
import globals from '../globals';
import pushNotification from '../helpers/push';

export default function SocketConn() {


 const createSocketConnection =  () => {

  const API = `${globals().socket}`; 
  const socket = socketIOClient(API);
  
    socket.on("push", msg => {
     
     //send push notification
       const key = localStorage.getItem('locals-public-key');
       const path = window.location.pathname !== '/chat';
      
      if(key === msg[3] && path){
        const fullName = msg[2];
        pushNotification(fullName);
       
      }
  });
       
        return socket;
 }


  return createSocketConnection();
}



