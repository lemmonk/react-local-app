import React, {useContext, useState } from 'react';
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Loading from './Loading';

function LoginUser() {

  const history = useHistory();
  const {setUser} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
 
  const [input, setInput] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState({
  
    email: false,
    password: false,
    class: 'err-msg',
    errorMsg: null
  });

 

  const validateInput = () => {

    for (const item in input){
  
      setError({
        email: false,
        password: false,
        class: 'err-msg',
        errorMsg: null
      })
    
      if(input[item] === ''){
    
        setError((prev) => ({
          ...prev,
          [item] : true,
          errorMsg: 'Missing required field'
        }));

      return;
      }
  
    }

      if(!input.email.includes('@') || !input.email.includes('.')){
        setError((prev) => ({
          ...prev,
          email : true,
          errorMsg: 'Invalid email format'
        }));

      return;
      }


    
    return loginUser();
  };



  const loginUser = () => {
      setLoading(true);

      axios.post(`/api/users/login`, { input }).then((res) => {


          if (res.data === false){
          showPasswordRecovery();
         return setError((prev) => ({
                ...prev,
                email : true,
                password: true,
                errorMsg: 'Invalid credentials'
              }));
             
            }

          setInput(() => ({
            email: '',
            password: '',
          }));


          localStorage.setItem('locals-uid', res.data.uid);
          // console.log(res.data);
          setLoading(false);
          setUser(res.data);
          return history.push('/feed'),[history];
     
         
        }).catch((err) => {
          setLoading(false);
          return history.push('/'),[history];
        });
  
  }; 

 
  const showPasswordRecovery = () => {

    setTimeout(function(){
      return setError((prev) => ({
        ...prev,
        class: 'pass-msg',
        errorMsg: 'Send recovery email →'
      }));
    },4000)

   
  }

  const openRecovery = () => {
    if(error.class === 'err-msg')return;
    // return history.push('/recover'),[history];
   
    
    if(!input.email.includes('@') || !input.email.includes('.')){
      showPasswordRecovery();
      return setError((prev) => ({
        ...prev,
        email : true,
        errorMsg: 'Invalid email format'
      }));

    }
    
    const email = input.email;

    setInput(() => ({
      email: '',
      password: '',
    }));

    axios.post(`/api/users/recovery`, { email }).then((res) => {

      // console.log(res.data);

        if (res.data === false){
      
          return setError((prev) => ({
                  ...prev,
                  email : true,
                  password: true,
                  errorMsg: 'Failed to reset, please try again.'
                }));
        }


        return history.push('/recover'),[history];
   
       
      }).catch((err) => {
        console.log(err);
        return history.push('/'),[history];
      });
  }

  
  return (
    <div>
    <DialogTitle>
      <div id="alert-dialog-title">
      Login
      </div>
     </DialogTitle>
      <DialogContent>
      <DialogContentText>
      Please login to get started.
    </DialogContentText>
     
          <TextField
          
            margin="dense"
            id="email"
            error={error.email}
            label="Email"
            type="email"
            variant='outlined'
            fullWidth

            value={input.email ? input.email : ''}
            onChange={(event) => setInput((prev) => ({
            ...prev,
            email: event.target.value
            }))}
          />

        <TextField
          autoComplete="new-password"
           margin="dense"
           id="password"
           error={error.password}
           label="Password"
           type="password"
           variant='outlined'
           fullWidth

           value={input.password ? input.password : ''}
           onChange={(event) => setInput((prev) => ({
           ...prev,
           password: event.target.value
           }))}
         />
       
      </DialogContent>

      <DialogActions className='full-length-btn'>
        
        <button  onClick={() => validateInput()}>
          Login
        </button>
     
       
      </DialogActions>
      <div className={error.class} onClick={() => openRecovery()}>
        <h4>{error.errorMsg}</h4>
        </div>
     
  </div>
  );
}

export default LoginUser;
