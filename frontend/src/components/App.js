import React, { useState } from 'react';
import AppRoutes from "./AppRoutes";
import UserContext from './UserContext';
import Footer from './Footer';


function App() {

  const [user, setUser] = useState('');


  return (
    <div className="App">
 

  <UserContext.Provider value={{user, setUser}}>
    <AppRoutes/>
  </UserContext.Provider>
   <Footer/>
  

    </div>
  );
}

export default App;
