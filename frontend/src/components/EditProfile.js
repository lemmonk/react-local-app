import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import Loading from './Loading';

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

import DynamicDialog from './DynamicDialog';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function EditProfile() {
  const server = 'http://localhost:8080/images/'; // <---TEMP.

  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    title: null,
    content: null
  })

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

    
   

    return editUserProfile();
  };


  const checkHostDetails = () => {

    const id = user.connect_id;
    
    
    axios.get(`/api/stripe/${id}`)
    .then(res => {
  
    // console.log('HOST',res.data)
  
    if(res.data.details_submitted){ // <-- stripe connect details 
      
      return validateEditHost();
  
    } 

    setDialog({
      open: true,
      title: 'Transactions',
      content: <p>
        We couldn't find your payment details.  This is either because your session has timed out or you did not complete your Stripe onboarding.
        In order to be a Local Host you must be able to except payments from your booked clients.<br></br><br></br>  Locals App uses <a href='https://stripe.com' target='_blank'>Stripe payments</a>  to securely connect your account and encrypt all money transfers.
      </p>
    })

  
    })
    .catch(err => {
      console.log(err);
    });
  }


  const validateEditHost = () => {
   
    for (const item in mandatory) {

      setError({
        
        city: false,
        bio: false,
        day_rate: false,
        errorMsg: null
      })

     
        if (mandatory[item] === null || mandatory[item] === undefined | mandatory[item] === 0) {

        
          return setError((prev) => ({
            ...prev,
            [item]: true,
            errorMsg: 'Missing required field'
          }));
        }

      }

    if(Number(input.day_rate) > 999){
      return setError((prev) => ({
        ...prev,
        day_rate: true,
        errorMsg: 'You may be good, but your not that good.'
      }));

    }

    if(input.city.length > 35){
      return setError((prev) => ({
        ...prev,
        city: true,
        errorMsg: 'Please find a more concise way to display your location.'
      }));

    }

    if(input.social_link.length > 100){
      return setError((prev) => ({
        ...prev,
        social_link: true,
        errorMsg: 'Invalid social link'
      }));

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

    setLoading(true);
    axios.patch(`/api/users/edit`, { update }).then((res) => {

      // console.log(res.data);
      setLoading(false);
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
      setLoading(false);
      const msg = 'Something went wrong 😧';
      const cc = 'edit-snackbar-error';
      handleSnack(TransitionUp, msg, cc);
    });

  };





  const save = () => {

    if (value === 'Yes') {
      checkHostDetails();
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

    setImg((URL.createObjectURL(file)))
    
    const FD = new FormData();
    FD.append("image", file);
    FD.append("ref", user.image);
    FD.append("uid", localStorage.getItem('locals-uid'));
    FD.append("email", user.email);

    setLoading(true);
    axios.post('/api/users/editImg', FD, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        
        setLoading(false);

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
      .catch((err) => {
        const msg = 'Failed to upload image.';
        const cc = 'edit-snackbar-error';
        handleSnack(TransitionUp, msg, cc);
      });
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

      setError({
        city: false,
        bio: false,
        day_rate: false,
        errorMsg: null
      })
     
      if(!user.connect_id){
     
        setDialog({
          open: true,
          title: 'Transactions',
          content: <p>
            In order to be a Local Host you must be able to except payments from your clients.<br></br><br></br>Locals App uses <a href='https://stripe.com' target='_blank'>Stripe payments</a>  to securely connect your account and encrypt all money transfers.
          </p>
        })

       
       return;
    
      }

      setValue(event.target.value);
     
    };

    const closeDynamicDialog = () => {
      setDialog({
        open:false,
        title: null,
        content:null
      })
    }

    const stripeOnboarding = () => {

      const input = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: null
       //password required < -------------------TODO
      }

      setLoading(true);
    
      axios.post(`/api/stripe/createAccountLink`, {input})
      .then(res => {
    
      // console.log(res.data)
      setLoading(false);
      localStorage.setItem('connect-id', res.data.id);
      window.open(res.data.link.url);
    
      })
      .catch(err => {
        console.log(err);
      });
    }
  
    
  
  
  const hourly_rate = <div>
    <h3>Required</h3>
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
  

  const bio = <div>
    <TextField
  className='edit-bio'
  margin="dense"
  id="bio"
  error={error.bio}
  multiline
  rows={8}
  label="Bio (250 char. limit)"
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
  <p className={input.bio && 250 - input.bio.length < 0 ? 'char-err-text' : 'char-ok-text'}>{input.bio ? `remaining: ${250 - input.bio.length}` : `remaining: 300`}</p>
  
  </div>
</div>
  
  
    const host_info =
      <div className={value === 'Yes' ? 'edit-host-info' : null}>
        
      
  {value === 'Yes' ? hourly_rate : null}
  
  
  <TextField
  
  margin="dense"
  id="city"
  error={error.city}
  label="Location"
  type="text"
  variant='outlined'
  fullWidth
  
  value={input.city ? input.city : ''}
  onChange={(event) => setInput((prev) => ({
    ...prev,
    city: event.target.value
  }))}
  />
  
  {value === 'Yes' ? bio : null}
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
    }, 8000)
  
  }

  const handleClose = () => {
    setOpen(false);
  };




  const logout = () => {
    
    const public_key = user.public_key;
    localStorage.clear();
    setUser(null);

    setLoading(true);
    axios.patch(`/api/users/logout`, {public_key})
    .then(res => {

    // console.log(res.data)
    setLoading(false)
    return history.push('/'), [history];

    })
    .catch(err => {
      setLoading(false)
      return history.push('/'), [history];
    });

   
  }


  return (
    <div>
      {loading ? <Loading/> : null}
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
                <FormControlLabel  value='Yes' control={<Radio />} label="Yah!" />
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
        {social}

        <div className='err-msg'>
          <h4>{error.errorMsg}</h4>
        </div>


      </DialogContent >
      <DialogActions className='full-length-btn'>
       
        <button onClick={() => save()} >
          Save
        </button>
      
       
      </DialogActions>

    <div className='edit-logout'><button onClick={() => logout()}>logout</button></div>
      

      <DynamicDialog
      open={dialog.open}
      close={closeDynamicDialog}
      title={dialog.title}
      content={dialog.content}
      action={stripeOnboarding}
      />

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
