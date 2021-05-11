import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React, { useContext, useEffect } from 'react';
import  UserContext  from './UserContext';
import axios from 'axios';

import NavBar from "./NavBar";
import Splash from "./Splash";
import Welcome from "./Welcome";
import Confirm from "./Confirm";
import Feed from "./Feed";
import CreateUser from "./CreateUser";
import LoginUser from "./LoginUser";
import Recovery from "./Recovery";
import Recover from "./Recover";
import Inbox from "./Inbox";
import EditProfile from "./EditProfile";
import Bookings from "./Bookings";
import Scheduler from "./Scheduler";
import Chat from "./Chat";


function AppRoutes() {
  window.scrollTo(0, 0);

  const {user, setUser} = useContext(UserContext);
  
  useEffect(() => {
    const uid = localStorage.getItem('locals-uid');

    if(!user && uid){

    axios.post('/api/users/session', { uid })
    .then(res => {
     
      if(res.data.verified){
     
        setUser(res.data);

      } 
      
    })
    .catch(err => {
      console.log(err);
    });
  }

  },[]);

 
  return (
    <div className="App">
  
    <Router>
   
      <Switch> 
          <Route exact path="/">
            <NavBar
            logo={true}
            title='Locals'
            nav={true}
            action={null}
            />
            <Splash />
            <Feed />
          </Route>

          <Route exact path="/create">
             <NavBar
             logo={false}
             title={null}
             nav={false}
             action='/'
            />
            <CreateUser />
          </Route>

          <Route exact path="/welcome">
              <NavBar
            logo={true}
            title={null}
            nav={false}
            action={null}
            />
            <Welcome />
          </Route>

          <Route exact path="/confirm">
              <NavBar
             logo={true}
             title='Locals'
             nav={true}
             action={null}
            />
            <Confirm />
          </Route>

          <Route exact path="/login">
        
              <NavBar
            logo={false}
            title={null}
            nav={false}
            action={null}
            />
            <LoginUser />
          </Route>

          <Route exact path="/recovery"
          render={(props) => (
            <>
            <NavBar
            logo={false}
            title={null}
            nav={false}
            action={null}
           /> 
            <Recovery {...props} />
            </>
          )}
          >

          </Route>

          <Route exact path="/recover">
        
        <NavBar
      logo={true}
      title={null}
      nav={false}
      action={null}
      />
      <Recover />
    </Route>


          <Route exact path="/feed">
              <NavBar
             logo={true}
             title='Locals'
             nav={true}
             action={null}
            />
            <Feed />
          </Route>


          <Route exact path="/bookings"
          render={(props) => (
            <>
            <NavBar
            logo={true}
            title='Bookings'
            nav={true}
            action={null}
           /> 
            <Bookings {...props} />
            </>
          )}
          >
          
          </Route>


          <Route exact path="/edit">
              <NavBar
             logo={true}
             title='Profile'
             nav={true}
             action='/'
            />
            <EditProfile />
          </Route>


          <Route exact path="/scheduler">
              <NavBar
             logo={true}
             title='Schedule'
             nav={true}
             action={null}
            />
            <Scheduler />
          </Route>


          <Route exact path="/inbox"
          
          render={(props) => (
            <>
             <NavBar
             logo={true}
             title='Inbox'
             nav={true}
             action='/'
            /> 
            <Inbox {...props} />
            </>
          )}
          >
          
          </Route>
             

          
          <Route exact path="/chat"
          render={(props) => (
            <>
            <NavBar
            logo={false}
            title={null}
            nav={false}
            action='/'
           /> 
            <Chat {...props} />
            </>
          )}
          >
          
          </Route>
            
          

         
        </Switch>

    </Router>

    </div>
  );
}

export default AppRoutes;
