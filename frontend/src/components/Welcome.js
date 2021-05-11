import React, { useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';

function Welcome() {

const {user} = useContext(UserContext);
const history = useHistory();
  
  

if(!user)return history.push('/'),[history];

const welcome = `Welcome ${user ? user.first_name : ''}`;
const message = ` Please follow the link sent to ${user ? user.email :  ''} to confirm your account before logging in.`;

 
  return (
<section className="splash">

    <div className='hook'>
    <h1>
    {welcome}
    </h1>
    <p>
    {message} 
    </p>
    </div>

</section>
  );
}

export default Welcome;
