import React, { useContext, useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';
import axios from 'axios';
import Loading from './Loading';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Confirm() {


const {setUser} = useContext(UserContext);

const history = useHistory();
const [loading, setLoading] = useState(false);
const [confirm, setConfirmed] = useState(false);

useEffect(() => {

  
  const url_string = window.location.href;
  const url = new URL(url_string);
  const url_id = url.searchParams.get("i");
  window.history.replaceState({}, document.title, "/" + "");
    
  if(url_id){
    return isConfirm(url_id);
  }
  
  setUser(null);
  localStorage.clear();
  
 
},[]);


const isConfirm = url_id => {

  setLoading(true);
  axios.patch('/api/users/confirm', {url_id})
  .then(res => {
   
    if(!res.data){
      return setLoading(false);;
    }
   
    const confirmed = res.data;
    if(confirmed.verified){
    
    localStorage.setItem('locals-uid', confirmed.uid);
   
    setLoading(false);
    setConfirmed(true);
    }
 
  })
  .catch(err => {
    setConfirmed(false);

})}

const update = confirm ? "Thank you for confirming your account, you can now book and become a host." : 'Unable to verify your account.';

const onNext = () => {

  return history.push('/'),[history];
}
 
  return (
<section className="incoming-wrapper">

<div className='incoming-content'>
  <p>
  {loading ? <Loading/> : update}
  </p>

 {loading ? null :  <div className='incoming-icons'>
    <ExitToAppIcon
    onClick={() => onNext()}
    fontSize='large'
    />
   </div>}
</div>

  
</section>
  );
}

export default Confirm;
