import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './Loading';
import {useHistory} from 'react-router-dom';

function Rating() {

  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {

    const url_string = window.location.href;
    const url = new URL(url_string);
    window.history.replaceState({}, document.title, "/" + "");
    
    const input = {
      id: url.searchParams.get("i"),
      ref: url.searchParams.get("r"),
      type: url.searchParams.get("t"),
      rating: url.searchParams.get("rate")
    }


    let dir = null;
    if(input.type === 'h') {
      dir = '/api/rating/host';
    } else if (input.type === 'u'){
      dir = '/api/rating/user'
    }

    if(!dir) return history.push('/'),[history];;

    axios.post(dir, { input })
    .then(res => {
     
    // console.log(res.data);

    setLoading(false);

    if(res.data){
      setMessage('Your rating has been successfully collected, thank you for using and continuing to use Locals.');
    } else {
      setMessage('You may only input one rating per booking.');
    }
    
     
      
    })
    .catch(err => {
      //silent error
      setLoading(false);
      console.log(err);
    });

  },[]);
 


  return (
<section className="incoming-wrapper">

    {loading ? <Loading/> : null}
    <div className='incoming-content'>
    <p>
    {message ? message : 'Ratings Page'} 
    </p>
    </div>

</section>
  );
}

export default Rating;
