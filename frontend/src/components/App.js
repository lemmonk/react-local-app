import React, { useState, useEffect } from 'react';
import SocketConn from '../helpers/socket';
import AppRoutes from "./AppRoutes";
import UserContext from './UserContext';
import SocketContext from './SocketContext';
import Footer from './Footer';

function App() {

  const [user, setUser] = useState('');
  const [socket, setSocket] = useState('');
  
  useEffect(() => {
  
    if(!socket){
      const conn = SocketConn();
      setSocket(conn);
    }
 
   },[]);

  return (
    <div className="App">
 
   <SocketContext.Provider value={{socket, setSocket}}>
    <UserContext.Provider value={{user, setUser}}>
    <AppRoutes/>
    </UserContext.Provider>
    </SocketContext.Provider>
   
    <Footer/>
   
  

    </div>
  );
}

export default App;
