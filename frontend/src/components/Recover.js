import React, {  useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

function Recover() {

const [ui, setUi] = useState({
  welcome: null,
  message: null
})

const history = useHistory();
  
useEffect(() => {

  
  const url_string = window.location.href;
  const url = new URL(url_string);
  
  const params = {
    id: url.searchParams.get("r"),
    email: url.searchParams.get("e")
  }
 
  if(params && params.id){
   
    return history.push({
      pathname: '/recovery',
      state: { detail: params }
    }),[history];

  }

  if(sessionStorage.getItem('locals-rec')){

    setUi({
      welcome: 'Password Reset',
      message: 'Your password has been successfully reset, you will be redirected to your login momentarily.'
    })
    sessionStorage.clear();
  
    setTimeout(function(){
      return history.push('/login'),[history];
    },8000)
  
  } else {

    setUi({
      welcome: 'Recovery Sent',
      message: 'Please follow the link sent to your provided email to reset your password.'
    })

  }

 
  

 
},[]);





  return (
<section className="splash">

    <div className='hook'>
    <h1>
    {ui.welcome ? ui.welcome : null}
    </h1>
    <p>
    {ui.message ? ui.message : null} 
    </p>
    </div>

</section>
  );
}

export default Recover;
