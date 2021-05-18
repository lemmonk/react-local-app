import React, { useContext, useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';
import axios from 'axios';
import Loading from './Loading';

function Confirm() {

const {setUser} = useContext(UserContext);

const history = useHistory();
const [confirm, setConfirmed] = useState({
  loading: true,
  confirmed: false
});

useEffect(() => {

  
  const url_string = window.location.href;
  const url = new URL(url_string);
  const url_id = url.searchParams.get("i");
 
  if(url_id){
    return isConfirm(url_id);
  }
  
  
  localStorage.clear();
  setUser(null);
  setConfirmed({
    loading: false,
    confirmed: false
  })
 
},[]);


const isConfirm = url_id => {

  axios.patch('/api/users/confirm', {url_id})
  .then(res => {
   
    // console.log(res.data);
    const confirm = res.data;
    if(confirm.verified){
    
    localStorage.setItem('locals-uid', confirm.uid);
   
    setConfirmed({
      loading: false,
      confirmed: true
    })
    }


   
   setTimeout(function(){
 return history.push('/feed'),[history];
   },6000)
  
    
  })
  .catch(err => {
    setTimeout(function(){
      return history.push('/feed'),[history];
        },6000)
  });

}

const update = confirm.confirmed ? "Thank you for confirming your account, you will be redirected momentarily." : 'Unable to verify your account.';
 
  return (
<section className="splash">

<div className='hook'>
 {confirm.loading ? <Loading/> : update}

</div>

  
</section>
  );
}

export default Confirm;
