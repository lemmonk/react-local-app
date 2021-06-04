import React, { useState, useEffect } from 'react';
import axios from "axios";
import {useHistory} from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Loading from './Loading';


function Connect() {
  const history = useHistory();
  const [state, setState] = useState(false);
 const [loading, setLoading] = useState(true);


  useEffect(() => {

const id = localStorage.getItem('connect-id');
localStorage.removeItem('connect-id');
if(!id)return;

  axios.get(`/api/stripe/${id}`)
  .then(res => {

    setLoading(false);
  if(res.data.details_submitted){
    setState(res.data.details_submitted);
  
  }
 

  })
  .catch(err => {
    setLoading(false);
    console.log(err);
  });
},[]);

const onBack = () => {
  return history.push('/edit'),[history];
}

const msg = state ? 'Thank you for connecting your payment details, you may now head back and complete your hosting profile.' : '...';



  return (
    <section className='incoming-wrapper'>

      {loading ? <Loading/> : null}

    <div className='incoming-content'>
    <p>{msg}</p>
    </div>



    <div className='incoming-icons'>
    <ExitToAppIcon
    onClick={() => onBack()}
    fontSize='large'
    />
   </div>
   
   
  
    </section>
    
  );
}

export default Connect;
