import React, { useContext, useState, useEffect } from 'react';
import globals from '../globals';
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
import StarIcon from '@material-ui/icons/Star';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import DynamicDialog from './DynamicDialog';

import { withStyles } from '@material-ui/core/styles';
const EditTextField = withStyles({
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


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function EditProfile() {
  
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    title: null,
    content: null,
    action: null,
  })

  const [input, setInput] = useState({
    host: user ? user.host : false,
    city: user ? user.city : null,
    image: user ? user.image : null,
    bio: user ? user.bio : '',
    day_rate: user ? user.day_rate : null,
    social_link: user ? user.social_link : ''
  });

  const [mandatory, setMandatory] = useState({
    city: user ? user.city : null,
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
    
     setLoading(true);
    axios.post('/api/users/session', { uid })
      .then(res => {

        // console.log(res.data)

        if (res.data.verified) {
          setUser(res.data);
          setInput(res.data);
          const host = res.data.host ? 'Yes' : 'No';
          setValue(host);
          setLoading(false);
        } else {
          setLoading(true);
          localStorage.clear();
          setUser(null);
          return history.push('/create'), [history];
        }

      })
      .catch(err => {

        console.log(err);
        return history.push('/'),[history];
      });


  }, []);


  useEffect(() => {

    setMandatory({
      city: input.city,
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
        In order to be a Local Host you must be able to accept payments from your booked clients.<br></br><br></br>  Locals app uses <a href='https://stripe.com' target='_blank'>Stripe payments</a>  to securely connect your account and encrypt all money transfers.
      </p>,
       action: stripeOnboarding
    })

  
    })
    .catch(err => {
      // console.log(err);
      setError({
        
        city: false,
        bio: false,
        day_rate: false,
        errorMsg: "Something went wrong 😧"
      })
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

   
        if (!mandatory[item] || mandatory[item] === null || mandatory[item] === undefined | mandatory[item] === 0) {

        console.log('here')
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

    if(Number(input.day_rate) < 7){
      return setError((prev) => ({
        ...prev,
        day_rate: true,
        errorMsg: 'Minimum wage is $7 an hour.'
      }));

    }

    if(input.city.length > 25){
      return setError((prev) => ({
        ...prev,
        city: true,
        errorMsg: 'Please find a more concise way to display your location.'
      }));

    }

   
    

    if(input.bio.length > 300){
    
      return setError((prev) => ({
        ...prev,
        bio: true,
        errorMsg: 'Your bio must be 300 characters of less'
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
      if (!res.data) {
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

 const [tempImg, setTempImg] = useState(null);

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

    setTempImg((URL.createObjectURL(file)))
    
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
        console.log(res.data)

      if (!res.data){
      const msg = 'Failed to upload image.';
      const cc = 'edit-snackbar-error';
     return handleSnack(TransitionUp, msg, cc);
        }

      // setUser(res.data);
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
            In order to be a Local Host you must be able to accept payments from your guest.<br></br><br></br>Locals app uses <a href='https://stripe.com' target='_blank'>Stripe payments</a>  to securely connect your account and encrypt all money transfers.
          </p>,
          action: stripeOnboarding
        })

       
       return;
    
      }

      setValue(event.target.value);
     
    };

    const closeDynamicDialog = () => {
      setDialog((prev) =>({
        ...prev,
        open:false,
       
      }))
    }

    const stripeOnboarding = () => {

      const input = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: null
       //password required < -------------------TODO
      }

      console.log(input);
      setLoading(true);
    
      axios.post(`/api/stripe/createAccountLink`, {input})
      .then(res => {
    
      console.log(res.data)
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
      <EditTextField
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
    <EditTextField
 
  className='edit-bio'
  margin="dense"
  id="bio"
  error={error.bio}
  multiline
  rows={8}
  label="About (300 char. limit)"
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
  <p className={input.bio && 300 - input.bio.length < 0 ? 'char-err-text' : 'char-ok-text'}>{input.bio ? `remaining: ${300 - input.bio.length}` : `remaining: 300`}</p>
  
  </div>
</div>
  
  
    const host_info =
      <div className={value === 'Yes' ? 'edit-host-info' : null}>
        
      
  {value === 'Yes' ? hourly_rate : null}
  
  <EditTextField
  
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
  
      </div>





const social = <div className='text-div'>
      <EditTextField
  
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


//profile rating ui and calc

const [showRating, setRating] = useState(false);
const calcRating = () => {

  let rating = 0;
  if(user){

    let total = user.thumbs_up + user.thumbs_down;
   
    if(total > 10){
    setRating(true);
    rating = Math.ceil(user.thumbs_up / total * 100);
    rating = Number.isNaN(rating) ? 0 : rating;
    }
  }
  return rating;
}

const rating =  <div>
<StarIcon  className={calcRating() > 84 ? 'star-lite' : 'star-dim'}/>
<StarIcon  className={calcRating() > 74 ? 'star-lite' : 'star-dim'}/>
<StarIcon  className={calcRating() > 64 ? 'star-lite' : 'star-dim'}/>
<StarIcon  className={calcRating() > 54 ? 'star-lite' : 'star-dim'}/>
<StarIcon  className={calcRating() > 4 ? 'star-lite' : 'star-dim'}/>
</div>


const onRatingClicked = () => {

  let msg = 'You currently do not have enough data to display an accurate rating. In the meantime your rating will be displayed as "No rating available".  Once your account has accumulated enough data for an accurate rating the results will be shown here and on your public facing profile, both as a host and as a guest.'

  if(showRating){
    msg = 'This is your accumulated rating from your encounters with host and guest alike.'
  }


  setDialog({
    open: true,
    title: 'Your Rating',
    content: <p>{msg}</p>,
    action: closeDynamicDialog
  })

}


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
    sessionStorage.clear();
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


  // ui profile image
  const [imgLoaded, setImageLoaded] = useState({
    loaded: 'edit-img-loading',
    class: 'init-edit-img',
    img: '/images/user.png',
  });
  const onImgLoaded = () => {
  
    setImageLoaded({
      loaded: 'edit-img',
      class: 'loaded-edit-img',
      img: user.image ? `${globals().server}${user.image}`
      : '/images/user.png',
    });
  }

  const onImgError = () => {

    setImageLoaded({
      loaded: 'edit-img',
      class: 'loaded-edit-img',
      img: '/images/user.png',
    });

  }

 
  return (
    <div className='edit-wrapper'>
      {loading ? <Loading/> : null}

      <DialogContent>

        <div className='edit-header'>
       
        <Button
          className='edit-profile-pic'
          variant="contained"
          component="label"
        >
             
{user ? 
<div className={imgLoaded.loaded}>

{tempImg ? <img className={imgLoaded.class} src={tempImg}></img> 
:
<img className={imgLoaded.class} src={imgLoaded.img} alt='n/a' onLoad={() => onImgLoaded()} onError={() => onImgError()}></img>
}
</div>
: <img className='loaded-edit-img' src='/images/user.png' alt='img'></img>
}

      
        <input type="file" hidden
          onChange={(event) => handleImageUpload(event.target.files[0])}
        />

        </Button>

          <div>
            <FormControl component="fieldset"
              className='edit-radio'
            >
              <h2
                className='radio-title'
              >I am a local host</h2>
              <RadioGroup aria-label="Host" name="Host" value={value} onChange={handleChange}>
                <FormControlLabel  value='Yes' control={<Radio />} label="Yes" />
                <FormControlLabel value='No' control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <h3>{user ? `${user.first_name} ${user.last_name}` : null}</h3>
        <p>{user ? user.email : null}</p>

        

        <div className={showRating ? 'edit-calendar-icon-all' : 'edit-calendar-icon'}
       
        > 

<div className='edit-icons' onClick={() => onRatingClicked()} >
       {showRating ?  rating : <StarIcon fontSize='large'/>}
       </div>

        <div className='edit-icons'> 
        <EventIcon
        onClick={() => gotoCalendar()}
        fontSize='large'
        />
        </div> 
        </div>

       
      

        {host_info}
        {bio}
        {social}
       

        {value === 'No' ?
      <div className='edit-info-blurb'>
      <p>
        Profile information for travellers will only be shared with booked host.
      </p>
      </div>
      : null }
      
      </DialogContent >
      <DialogActions className='full-length-btn'>
       
        <button onClick={() => save()} >
          Save
        </button>
      
      </DialogActions>

      <div className='err-msg'>
          <h4>{error.errorMsg}</h4>
        </div>

       

    <div className='edit-logout'><button onClick={() => logout()}>logout</button></div>
      

      <DynamicDialog
      open={dialog.open}
      close={closeDynamicDialog}
      title={dialog.title}
      content={dialog.content}
      action={dialog.action}
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
