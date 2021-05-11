import React, {useState, useEffect, useContext } from 'react';
import  UserContext  from './UserContext';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import Loading from './Loading';


function Splash() {

  const {setUser} = useContext(UserContext);
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true)
    const uid = localStorage.getItem('locals-uid');
  
    if (uid) {
    return isSession(uid);
  } 

    setLoading(false);
    localStorage.clear();
    setUser(null);
  
  },[]);

  const isSession = uid => {

    axios.post('/api/users/session', { uid })
    .then(res => {
     
      // console.log(res.data)
      setLoading(false);

      if(res.data.verified){
        setLoading(false);
        setUser(res.data);
        return history.push('/feed'),[history];

      } 
        setLoading(false);
        localStorage.clear();
        setUser(null);
        return history.push('/feed'),[history];
      
      
    })
    .catch(err => {
      console.log(err);
    });

  }



  const openSignUp = () =>{
    
    return history.push('/create'),[history];
    
  }

  


  const splash = <div className='splash'> 
    <div className='hook'>
    <h1>
    Let a local guide your next trip
    </h1>
    </div>
    <div className='pitch'>
    <h3>
     or – be that local. 
    </h3>
    </div>
    <div className='call-to-action'>
    <button onClick={() => openSignUp()}>Get Started</button>
    </div>
    </div>

  return (
    <section>
      
    {loading ? <Loading/> : splash}
    <div className='divider'></div>
    </section>
  );
}

export default Splash;
