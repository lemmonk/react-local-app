import React, {useContext, useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';


function CreateUser() {

  const {setUser} = useContext(UserContext);
  const history = useHistory();
 
  const [input, setInput] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState({
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
    password: false,
    errorMsg: null
  });

 

  const validateInput = () => {

    for (const item in input){
  
      setError({
        first_name: false,
        last_name: false,
        email: false,
        phone: false,
        password: false,
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


      if(input.password.length < 8){
        setError((prev) => ({
          ...prev,
          password : true,
          errorMsg: 'Passords must be 8 characters or more'
        }));

      return;
      }


    
    return createNewUser();
  };




  const createNewUser = () => {

      axios.post(`/api/users/create`, { input }).then((res) => {

  
          if (res.data === 'exist'){
            return  setError((prev) => ({
                ...prev,
                email : true,
                errorMsg: 'Email already exist'
              }));
            }

          setInput(() => ({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
          }));


         
          setUser(res.data);
          return history.push('/welcome'),[history];
     
         
        }).catch((err) => {
         alert('ERROR');
        });
  
  }; 

 

 
 
  return (
    <div>
    <DialogTitle id="form-dialog-title">Create Account</DialogTitle>
      <DialogContent>
      <DialogContentText>
      Once you create an account you can choose to be a traveller, a host or both.
    </DialogContentText>
      <TextField
            autoFocus
            margin="dense"
            id="first_name"
            error={error.first_name}
            label="First name"
            type="text"
            variant='outlined'
            fullWidth

            value={input.first_name ? input.first_name : ''}
            onChange={(event) => setInput((prev) => ({
            ...prev,
            first_name: event.target.value
            }))}

          />
           <TextField
           
            margin="dense"
            id="last_name"
            error={error.last_name}
            label="Last name"
            type="text"
            variant='outlined'
            fullWidth

            value={input.last_name ? input.last_name : ''}
            onChange={(event) => setInput((prev) => ({
            ...prev,
            last_name: event.target.value
            }))}
          />
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
           
           margin="dense"
           id="phone"
           error={error.phone}
           label="Phone"
           type="phone"
           variant='outlined'
           fullWidth

           value={input.phone ? input.phone : ''}
           onChange={(event) => setInput((prev) => ({
           ...prev,
           phone: event.target.value
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

     
            <div className='err-msg'>
            <h4>{error.errorMsg}</h4>
            </div>
          

      </DialogContent>
      <DialogActions>
        <Button onClick={() => validateInput()} color="primary">
          Create
        </Button>
      </DialogActions>

     
  </div>
  );
}

export default CreateUser;
