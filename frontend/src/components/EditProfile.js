import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from './UserContext';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import EventIcon from '@material-ui/icons/Event';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function EditProfile() {
  const server = 'http://localhost:8080/images/'; // <---TEMP.

  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const [input, setInput] = useState({
    host: user ? user.host : false,
    city: user ? user.city : null,
    image: user ? user.image : null,
    bio: user ? user.bio : null,
    day_rate: user ? user.day_rate : null,
    social_link: user ? user.social_link : null
  });

  const [mandatory, setMandatory] = useState({
    city: user ? user.city : null,
    bio: user ? user.bio : null,
    day_rate: user ? user.day_rate : null,
  });

  const [error, setError] = useState({
  
    city: false,
    bio: false,
    day_rate: false,
    errorMsg: null
  });



  useEffect(() => {
    
    if(!user)return history.push('/'),[history];

    const uid = localStorage.getItem('locals-uid');
    axios.post('/api/users/session', { uid })
      .then(res => {

        // console.log(res.data)

        if (res.data.verified) {
          setUser(res.data);
          setInput(res.data);
          const host = res.data.host ? 'Yes' : 'No';
          setValue(host);

        } else {

          localStorage.clear();
          setUser(null);
          return history.push('/create'), [history];
        }

      })
      .catch(err => {
        console.log(err);
      });


  }, []);


  useEffect(() => {

    setMandatory({
      city: input.city,
      bio: input.bio,
      day_rate: input.day_rate,
    })

  }, [input]);



  const validateEditTraveller = () => {

    setError({
      
      city: false,
      bio: false,
      day_rate: false,
      errorMsg: null
    })

    if(input.bio.length > 250){
      return setError((prev) => ({
        ...prev,
        bio: true,
        errorMsg: 'Your bio must be 250 characters of less'
      }));
    }
   

    return editUserProfile();
  };



  const validateEditHost = () => {

    for (const item in mandatory) {

      setError({
        
        city: false,
        bio: false,
        day_rate: false,
        errorMsg: null
      })

     
        if (mandatory[item] === null || mandatory[item] === undefined | mandatory[item] === 0) {

          console.log(item)
          return setError((prev) => ({
            ...prev,
            [item]: true,
            errorMsg: 'Missing required field'
          }));
        }

      }

    

    if(input.bio.length > 250){
      return setError((prev) => ({
        ...prev,
        bio: true,
        errorMsg: 'Your bio must be 250 characters of less'
      }));
    }

  

    return editUserProfile();
  };


  const editUserProfile = () => {

    const host = value === "Yes" ? true : false;

    const update = {
      host: host,
      city: input.city,
      bio: input.bio,
      day_rate: input.day_rate ? input.day_rate : 0,
      social_link : input.social_link,
      uid: localStorage.getItem('locals-uid'),
      email: user.email,
    }

    axios.patch(`/api/users/edit`, { update }).then((res) => {

      // console.log(res.data);

      if (res.data === false) {
        const msg = 'Invalid Credentials';
        const cc = 'edit-snackbar-error';
       return handleSnack(TransitionUp, msg, cc);
      }

   
      setUser(res.data);
      const msg = 'Saved!';
      const cc = 'edit-snackbar';
      return handleSnack(TransitionUp, msg, cc);


    }).catch((err) => {
      const msg = 'Something went wrong 😧';
      const cc = 'edit-snackbar-error';
      handleSnack(TransitionUp, msg, cc);
    });

  };





  const save = () => {

    if (value === 'Yes') {
      validateEditHost();
    } else {
      validateEditTraveller();
    }
  }



  //upload image

  const [img, setImg] = useState(null)

  const handleImageUpload = file => {

    const imageType = /image.*/;

    if (!file.type.match(imageType)) {
      const msg = 'Only image files allowed.';
      const cc = 'edit-snackbar-error';
     return handleSnack(TransitionUp, msg, cc);
    }

    if (file.size > (2000 * 1024)) {
      const msg = 'The max allowable size for an image is 2MB.';
      const cc = 'edit-snackbar-error';
      return handleSnack(TransitionUp, msg, cc);
      
    }

    const msg = 'Saving...';
      const cc = 'edit-snackbar-error';
      handleSnack(TransitionUp, msg, cc);
    //sets image locally
    setImg((URL.createObjectURL(file)))

    const FD = new FormData();
    FD.append("image", file);
    FD.append("ref", user.image);
    FD.append("uid", localStorage.getItem('locals-uid'));
    FD.append("email", user.email);


    axios.post('/api/users/editImg', FD, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        
        if (res === false){
      const msg = 'Failed to upload image.';
      const cc = 'edit-snackbar-error';
      handleSnack(TransitionUp, msg, cc);
        }

      setUser(res.data);
      const msg = 'Image Saved.';
      const cc = 'edit-snackbar';
      handleSnack(TransitionUp, msg, cc);
      })
      .catch((err) => console.log(err));
  }


  const isLoaded = user ? user.image : null;
  const profileImg = isLoaded ? `${server}${user.image}` : '/images/user.png';
  const currentImg = img ? img : profileImg;



  const gotoCalendar = () =>{
    return history.push('/scheduler'), [history];
  }


    //input ui

    const [value, setValue] = useState('No');

    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    
  
  
  const hourly_rate = <div>
    <h3>Mandatory for Host</h3>
      <TextField
          margin="dense"
          id="hourly_rate"
          error={error.day_rate}
          label="Hourly Rate"
          type="number"
          variant='outlined'
          fullWidth
  
          value={input.day_rate ? input.day_rate : ''}
          onChange={(event) => setInput((prev) => ({
            ...prev,
            day_rate: event.target.value
          }))}
        />
  </div>
  
  
  
    const host_info =
      <div className={value === 'Yes' ? 'edit-host-info' : null}>
        
      
        {value === 'Yes' ? hourly_rate : null}
  
  
  <TextField
  
  margin="dense"
  id="city"
  error={error.city}
  label="Hometown"
  type="text"
  variant='outlined'
  fullWidth
  
  value={input.city ? input.city : ''}
  onChange={(event) => setInput((prev) => ({
    ...prev,
    city: event.target.value
  }))}
  />
  
  
  
  <TextField
  className='edit-bio'
  margin="dense"
  id="bio"
  error={error.bio}
  multiline
  rows={4}
  label="Bio (300 char. limit)"
  type="text"
  variant='outlined'
  fullWidth
  
  value={input.bio ? input.bio : ''}
  onChange={(event) => setInput((prev) => ({
    ...prev,
    bio: event.target.value
  }))}
  />
  <div className='edit-char-count'>
  <p>{input.bio ? `remaining: ${300 - input.bio.length}` : `remaining: 300`}</p>
  
  </div>
  
      </div>


const social = <div>
      <TextField
  
        margin="dense"
        id="social"
        label="Social Media Link"
        type="text"
        variant='outlined'
        fullWidth
  
        value={input.social_link ? input.social_link : ''}
        onChange={(event) => setInput((prev) => ({
          ...prev,
          social_link: event.target.value
        }))}
      />
    </div>


  //snackbar anim

  const [open, setOpen] = useState({
    dialog: false,
    snackbar: false,
    class: 'calendar-snackbar'
    
  });

  const [message, setMessage] = useState(null);
  const [transition, setTransition] = useState(undefined);


  const handleSnack = (Transition, msg, cc) => {

    setMessage(msg);
    setOpen((prev) => ({
      ...prev,
     snackbar: true,
     class: cc
    }));
    
    setTransition(() => Transition);
  
    setTimeout(function () {
      setOpen((prev) => ({
        ...prev,
       snackbar: false
      }));
    }, 5000)
  
  }

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    const public_key = user.public_key;
    localStorage.clear();
    setUser(null);

    axios.patch(`/api/users/logout`, {public_key})
    .then(res => {

    // console.log(res.data)
    return history.push('/'), [history];

    })
    .catch(err => {
      console.log(err);
      return history.push('/'), [history];
    });

   
  }

const isHost = value === 'Yes' ? true : null;

  return (
    <div>
      
      <DialogContent>

        <div className='edit-header'>
          <div className='edit-image'>


            <Button
              className='edit-profile-pic'
              variant="contained"
              component="label"
            >
              <img src={`${currentImg}`} alt='img' />
              <input type="file" hidden
                onChange={(event) => handleImageUpload(event.target.files[0])}
              />

            </Button>


          </div>

          <div>
            <FormControl component="fieldset"
              className='edit-radio'
            >
              <FormLabel component="legend"
                className='radio-title'
              >I am a local host</FormLabel>
              <RadioGroup aria-label="Host" name="Host" value={value} onChange={handleChange}>
                <FormControlLabel value='Yes' control={<Radio />} label="Yah!" />
                <FormControlLabel value='No' control={<Radio />} label="Nah" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <h3>{user ? `${user.first_name} ${user.last_name}` : null}</h3>
        <p>{user ? user.email : null}</p>

        <div className='edit-calendar-icon'
        onClick={() => gotoCalendar()}
        > 
        <div className='edit-calendar-inner'> <EventIcon
        fontSize='large'
        />
        </div> 
        </div>
        


      
        {host_info}
        {user ? social : null}



        <div className='create-err-msg'>
          <h4>{error.errorMsg}</h4>
        </div>


      </DialogContent>
      <DialogActions>
        
        <Button onClick={() => save()} color="primary">
          Save
        </Button>
      </DialogActions>

    <div className='edit-logout'><button onClick={() => logout()}>logout</button></div>
      

<div className={open.class}>

      <Snackbar
        open={open.snackbar}
        onClose={handleClose}
        TransitionComponent={transition}
        message={message}
        key={transition ? transition.name : ''}
      />
      </div>
    </div>
  );
}

export default EditProfile;
