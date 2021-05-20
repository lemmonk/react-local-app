import React, { useEffect, useContext } from 'react';
import globals from '../globals';
import  UserContext  from './UserContext';
import axios from 'axios';
import {useHistory} from 'react-router-dom';


function Splash() {

  const {setUser} = useContext(UserContext);
  const history = useHistory();

 
  useEffect(() => {

   
    const uid = localStorage.getItem('locals-uid');
  
    if (uid) {
    return isSession(uid);
  } 

    localStorage.clear();
    setUser(null);
  
  },[]);

  const isSession = uid => {

   const esc =  setTimeout(function(){
      
        localStorage.clear();
        setUser(null);
        return history.push('/'),[history];
    },12000);

    axios.post('/api/users/session', { uid })
    .then(res => {
     
    
      clearTimeout(esc);

      if(res.data.verified){
       
        setUser(res.data);
        return history.push('/feed'),[history];

      } 
      
        localStorage.clear();
        setUser(null);
        return history.push('/feed'),[history];
      
      
    })
    .catch(err => {
      //silent error
      console.log(err);
    });

  }



  const openSignUp = () =>{
    
    return history.push('/create'),[history];
    
  }


  const splash = <div className='splash'> 
 
  <div className='map-background'>
    <img
    className='map-foreground'
    scale='1'
    src={`https://maps.googleapis.com/maps/api/staticmap?center=Vancouver&zoom=10&size=500x3800&maptype=roadmap&key=${globals().map}`}></img>
  </div>

    <div className='hook'>
    <h3>
    Let a local show you their hometown
    </h3>
    </div>
    <div className='pitch'>
    <h3>
     or – be that local
    </h3>
    </div>
    <div className='call-to-action'>
    <button onClick={() => openSignUp()}>Get Started</button>
    </div>
    </div>

  return (
    <section>
    {splash}
    <div className='divider'></div>
    </section>
  );
}

export default Splash;
