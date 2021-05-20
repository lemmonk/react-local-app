import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';




function Connect() {
  const history = useHistory();
  const [state, setState] = useState(false);
 


  useEffect(() => {

const id = localStorage.getItem('connect-id');
localStorage.removeItem('connect-id');
if(!id)return;

  axios.get(`/api/stripe/${id}`)
  .then(res => {

  console.log(res.data)

  if(res.data.details_submitted){
    setState(res.data.details_submitted);
  
  }
 

  })
  .catch(err => {
    console.log(err);
  });
},[]);

const back = () => {
  return history.push('/edit'),[history];
}

const msg = state ? 'Thank you for connecting your payment details, you may now head back and complete your hosting profile.' : '...';



  return (
    <section className='incoming-wrapper'>

    <div className='incoming-content'>
    <p>{msg}</p>
    </div>



<div className='incoming-action'>
        
  <button  onClick={() => back()}>Back to profile</button>
     
      </div>
   
   
  
    </section>
    
  );
}

export default Connect;
