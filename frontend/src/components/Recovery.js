import React, {useState } from 'react';
import {useHistory} from 'react-router-dom';
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

function Recovery(props) {
  const history = useHistory();
  

 
  const [loading, setLoading] = useState(false);
  
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
          errorMsg: 'Passwords must be at least 8 characters'
        }));

      
      }
  
    return resetPassword();
  };



  const resetPassword = () => {

      setLoading(true);
      axios.post(`/api/users/reset`, { input }).then((res) => {

        // console.log(res.data);

          if (res.data === false){
            setLoading(false);
            return setError((prev) => ({
                    ...prev,
                    email : true,
                    password: true,
                    errorMsg: 'Session Expired'
                  }));
             
          }


          setInput((prev) => ({
            ...prev,
            password: null
          }));
          setLoading(false);
          sessionStorage.setItem('locals-rec', 'new');
          return history.push('/recover'),[history];
     
         
        }).catch((err) => {
          setLoading(false);
          return setError((prev) => ({
            ...prev,
            password: false,
            errorMsg: 'Failed to reset, please try again.'
          }));
        });
  
  }; 

 
  return (
    <div>
      {loading ? <Loading/> : null}
    <DialogTitle>
    <div id="alert-dialog-title">
      New Password
      </div>
    </DialogTitle>
      <DialogContent>
      <DialogContentText>
      Please enter your new password.
    </DialogContentText>
     
      
        <InputTextField
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
          

      </DialogContent>
      <DialogActions className='full-length-btn'>
        <button onClick={() => validateInput()} >
          Reset Password
        </button>
      </DialogActions>

      <div className={error.class}>
        <h4>{error.errorMsg}</h4>
        </div>
     
  </div>
  );
}

export default Recovery;
