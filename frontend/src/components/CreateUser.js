import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';

import axios from 'axios';
import Loading from './Loading';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import { withStyles } from '@material-ui/core/styles';
const InputTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#282828',
    },
   
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: '#45bdfe',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1eabf7',
      },
    },
  },
})(TextField);

function CreateUser() {
  

  const {setUser} = useContext(UserContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
 
  const [input, setInput] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    errorMsg: null
  });

 

  const validateInput = () => {

    for (const item in input){
  
      setError({
        first_name: false,
        last_name: false,
        email: false,
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

      setLoading(true);
      axios.post(`/api/users/create`, { input }).then((res) => {

  
          if (res.data === 'exist'){
            setLoading(false);
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
            password: '',
          }));


          setLoading(false);
          setUser(res.data);
          return history.push('/welcome'),[history];
     
         
        }).catch((err) => {
          setLoading(false);
          return  setError((prev) => ({
            ...prev,
            errorMsg: 'Something went wrong 😧'
          }));
        });
  
  }; 

 

 
 
  return (
    <div >
    {loading ? <Loading/> : null}
    <DialogTitle>
      <div id='alert-dialog-title'>
      Create Account
      </div>
    
      </DialogTitle>
      <DialogContent>
      <DialogContentText className='alert-dialog-content'>
    
    Created an account and choose to be a traveller, a host, or both.
   
    </DialogContentText>
      <InputTextField
    
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
           <InputTextField
           
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
          <InputTextField
           
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

         
        <InputTextField
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
        <button
        onClick={() => validateInput()} >
          Create
        </button>
      </DialogActions>

      <div className='err-msg'>
            <h4>{error.errorMsg}</h4>
            </div>
          
          <div className='create-terms'>
           
          <p>
             By continuing you confirm that you have read and agree to our <a href='/terms' target='_blank'>Terms of Service and Privacy Policy.</a>
           </p>
          </div>
     
  </div>
  );
}

export default CreateUser;
