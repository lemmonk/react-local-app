import React, {  useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Recover() {

const [ui, setUi] = useState({
  welcome: null,
  message: null,
  action: null,
})

const history = useHistory();

const onLogin = () => {
  return history.push('/login'),[history];
}
  
useEffect(() => {

  
  const url_string = window.location.href;
  const url = new URL(url_string);
  window.history.replaceState({}, document.title, "/" + "");

  
  
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
      welcome: null,
      message: 'Your password has been reset successfully.',
      action:  <div className='incoming-icons'>
      <ExitToAppIcon
      onClick={() => onLogin()}
      fontSize='large'
      />
     </div>
 
    })
    sessionStorage.clear();
  
  
  
  } else {

    setUi({
      welcome: null,
      message: 'Please follow the link sent to your provided email to reset your password.',
      action: null
    })

  }

},[]);





  return (
<section className="incoming-wrapper">

    <div className='incoming-content'>
    <h2>
    {ui.welcome ? ui.welcome : null}
    </h2>
    <p>
    {ui.message ? ui.message : null} 
    </p>
    {ui.action ? ui.action : null}
    </div>

</section>
  );
}

export default Recover;
