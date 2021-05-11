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


function Recovery(props) {

  const history = useHistory();
  
  const [input, setInput] = useState({
    id: props.location.state.detail.id,
    email: props.location.state.detail.email,
    password: '',
  });

  const [error, setError] = useState({
  
    password: false,
    class: 'err-msg',
    errorMsg: null
  });

 

  const validateInput = () => {

      setError({
        password: false,
        class: 'err-msg',
        errorMsg: null
      })
    
      if(input.password.length < 8){
    
       return setError((prev) => ({
          ...prev,
          password : true,
          errorMsg: 'Passwords must be at least 8 characters in length'
        }));

      
      }
  
    return resetPassword();
  };



  const resetPassword = () => {

      axios.post(`/api/users/reset`, { input }).then((res) => {

        console.log(res.data);

          if (res.data === false){
        
            return setError((prev) => ({
                    ...prev,
                    email : true,
                    password: true,
                    errorMsg: 'Failed to reset, please try again.'
                  }));
             
          }


          setInput((prev) => ({
            ...prev,
            password: null
          }));
          sessionStorage.setItem('locals-rec', 'new');
          return history.push('/recover'),[history];
     
         
        }).catch((err) => {
          return setError((prev) => ({
            ...prev,
            password: false,
            errorMsg: 'Failed to reset, please try again.'
          }));
        });
  
  }; 

 
  return (
    <div>
    <DialogTitle id="form-dialog-title">Password Recovery</DialogTitle>
      <DialogContent>
      <DialogContentText>
      Please enter your new password.
    </DialogContentText>
     
      
        <TextField
          autoComplete="new-password"
           margin="dense"
           id="password"
           error={error.password}
           label="New Password"
           type="password"
           variant='outlined'
           fullWidth

           value={input.password ? input.password : ''}
           onChange={(event) => setInput((prev) => ({
           ...prev,
           password: event.target.value
           }))}
         />
        <div className={error.class}>
        <h4>{error.errorMsg}</h4>
        </div>
          

      </DialogContent>
      <DialogActions>
        <Button onClick={() => validateInput()} color="primary">
          Set Password
        </Button>
      </DialogActions>

     
  </div>
  );
}

export default Recovery;
