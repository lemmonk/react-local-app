import React, { useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';

function Welcome() {

const {user} = useContext(UserContext);
const history = useHistory();
  
  

if(!user)return history.push('/'),[history];


const message = ` Please follow the link sent to ${user ? user.email :  'your provided email'} to confirm your account before logging in.`;

 
  return (
<section className="incoming-wrapper">

    <div className='incoming-content'>
    <p>
    {message} 
    </p>
    </div>

</section>
  );
}

export default Welcome;
