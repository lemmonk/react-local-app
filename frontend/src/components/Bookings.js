import React, {useState, useEffect, useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-awesome-calendar';
import NavBar from './NavBar';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';



function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function Bookings(props) {

  const {user} = useContext(UserContext);
  const history = useHistory();
  const [bookings, setBookings] = useState({
    state: [],
    identifier: props.location.state.detail.public_key
  });

  const [currentBooking, setCurrentBooking] = useState({
    ref: null,
    title: 'Hosting Booked',
    color: '#5f8aff',
    year: null,
    month: null,
    day: null,
    hour: null,
    formattedStartDate: null,
    formattedEndDate: null,
    duration: 0,
    next: false,
  })

  const [refresh, setRefresh] = useState(false);

  const uiManipulation = mode => {
    window.scrollTo(0, 0);
    const allButtons = document.querySelectorAll("button");
    const d = new Date();
    const currentMonth = d.getMonth();
    
    
    allButtons[1].innerHTML = '';
    allButtons[0].style.display = 'none';
    allButtons[2].style.display = 'none';
    
    if(!mode || mode.mode === 'monthlyMode'){
    
     
      allButtons[3].style.display = 'block';
      allButtons[4].style.display = 'block';
   
    } 

    if(!mode || mode.month === currentMonth){
      
      allButtons[3].style.display = 'none';
      allButtons[4].style.display = 'block';

    } else if (mode.month - currentMonth === 1) {
    
      allButtons[3].style.display = 'block';
      allButtons[4].style.display = 'block';

    } else if (mode.month - currentMonth >= 2 || mode.month < currentMonth){

     return history.push('/feed'),[history]; 

    }


    if (mode && mode.mode === 'dailyMode'){

      allButtons[3].style.display = 'none';
      allButtons[4].style.display = 'none';

    }
	};

 
  // const id = props.location.state.detail.public_key;
  useEffect(() => {
   
    uiManipulation(null);

    if(!localStorage.getItem('locals-uid'))
    return history.push('/create'),[history];
    
    if(!user)return history.push('/'),[history];
    
    const input = {
      id: bookings.identifier
    }

    axios.post(`/api/bookings/get`, {input})
    .then(res => {
    
      // console.log(res.data);
      setBookings((prev) => ({
        ...prev,
        state: res.data,
      }));
    })
    .catch(err => {
      console.log(err);
    });

  },[refresh]);


  //format booking to be read by calendar component
  const events = bookings ? bookings.state.map(each =>{

    return {
      id: each.id,
      color: each.color,
      from: each.start_time,
      to: each.end_time,
      title: each.title

    }

  }):  null;


  const openDay = trigger => {
    
    uiManipulation(trigger);
    const d = new Date();


    const elements = document.getElementsByClassName('dailyHourWrapper');
  
    for (let i = 0; i < elements.length; i++) {
     
     if( i > 21 && i < 25){
        elements[i].style.display = 'none';
      } 
    }
  }


  const openTime = trig => {
    const d = new Date();


    if(trig.day <= d.getDate()){
      const msg = "Bookings cannot be made day of or in the past.";
      const cc = 'calendar-snackbar-error';
      return handleSnack(TransitionUp, msg, cc);
    }
  
    if(trig.hour < 7 || trig.hour >= 22){
      const msg = "Bookings cannot be made between the hours of 10pm and 7am.";
      const cc = 'calendar-snackbar-error';
      return handleSnack(TransitionUp, msg, cc);
    }

   formateStartDate(trig)
   setOpen((prev) => ({
    ...prev,
   dialog: true
  }));
  };

  

//fetches booked hours for a selected day
  const fetchBookedHours = () => {

    const bookedHours = [];
    
    for(const booking of bookings.state) {
    
      if (currentBooking.formattedStartDate.substring(0,10) === booking.start_time.substring(0,10)){
        
        const start = Number(booking.start_time.substring(11,13));
        const end = Number(booking.end_time.substring(11,13))
      
        for (let i = start; i < end; i++){
          bookedHours.push(i);
        }

      } 

    }
    return bookedHours;
}

//TODO refactor
const setDuration = duration => {
 
  const durationArr = [];
  const length = currentBooking.hour + duration;
  for (let i = currentBooking.hour; i < length; i++){
   
    if(i >= 22){
      const msg = 'Bookings cannot be made between the hours of 10pm and 7am.';
      const cc = 'calendar-snackbar-error';
      return handleSnack(TransitionUp, msg, cc);
    }
   
      durationArr.push(i);
  }


  const bookedHours = fetchBookedHours();


   for(const hour of bookedHours){

    if(durationArr.includes(hour)){
      const msg = 'Your requested times conflict with an existing booking.';
      const cc = 'calendar-snackbar-error';
     return handleSnack(TransitionUp, msg, cc);
    } 
   }

   const formattedEndDate = formatEndDate(duration);

   setCurrentBooking((prev) => ({
    ...prev,
    ref: bookings.identifier,
    formattedEndDate: formattedEndDate,
    duration: duration,
    next: true
  }));

};

const onNext = () => {
//TODO Show payment modal...    <--------------------------------

  return createBooking();
}


const createBooking = () => {

 
  const input = {
    host_key: currentBooking.ref,
    user_key: user.public_key,
    name: `${user.first_name} ${user.last_name}`,
    city: user.city,
    image: user.image,
    title:'Hosting Booking',
    color:'#5f8aff',
    start: currentBooking.formattedStartDate,
    end: currentBooking.formattedEndDate,
    stamp: currentBooking.formattedStartDate.substring(0,10),
    email: user.email,
    uid: localStorage.getItem('locals-uid'),
  }


  //TODO create a message chat  
  axios.post(`/api/bookings`, { input }).then((res) => {

  if(res.data === false){

    const msg = 'Invaild Credentials';
    const cc = 'calendar-snackbar-error';
   return handleSnack(TransitionUp, msg, cc);
  }

   triggerUseEffect();
   const msg = 'Booking Complete. A confirmation email has been sent to both you and your host.';
   const cc = 'calendar-snackbar';
   return handleSnack(TransitionUp, msg, cc);
  
    // /return history.push('/inbox'),[history];
     
    }).catch((err) => {
      console.log(err);
      const msg = "Something went wrong ";
      const cc = 'calendar-snackbar-error';
      handleSnack(TransitionUp, msg, cc);
    });

}; 


const triggerUseEffect = () => {
  window.scrollTo(0, 0);
  handleClose();
  if(refresh){
    setRefresh(false);
  }else{
    setRefresh(true);
  }
}



const formateStartDate = date => {
  
   const year = date.year;
   date.month++;
   const month = date.month > 9 ? date.month  : `0${date.month}`;
   const day = date.day > 9 ? date.day : `0${date.day}`;
   let hour  = Math.floor(date.hour);
   hour = hour > 9 ? hour : `0${hour}`;
   const formatDate = `${year}-${month}-${day}T${hour}:00:00+00:00`;
    
   setCurrentBooking((prev) => ({
     ...prev,
     ref: null,
     year: year,
     month: month,
     day: day,
     hour: Number(hour),
     formattedStartDate: formatDate,
     duration: 0,
     next: false
   }));
}


const formatEndDate = duration => {

    let hour = currentBooking.hour + duration;
    const year = currentBooking.year;
    const month = currentBooking.month;
    const day = currentBooking.day;
    hour = hour > 9 ? hour : `0${hour}`;
    return `${year}-${month}-${day}T${hour}:00:00+00:00`;
}


//modal handlers

const [drop, setDrop] = React.useState(false);

const openDrop = () => {
  setDrop(true);
};

const closeDrop = () => {
  setDrop(false);
};


//snack update

const [message, setMessage] = useState(null);
const [transition, setTransition] = React.useState(undefined);
const [open, setOpen] = useState({
  dialog: false,
  snackbar: false,
  class: 'calendar-snackbar'
});

const handleClose = () => {

  setOpen((prev) => ({
    ...prev,
    dialog: false,
    snackbar: false
   }));
}


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

  return (
   
    <>
    
    <div  className='calendar'>

    <Calendar
        events={events}
        onChange={(trig) => openDay(trig)}
        onClickTimeLine={(trig) => openTime(trig)}
        />   

      <h3>{props.location.state.detail.name ? props.location.state.detail.name: null}</h3> 

      <h3>{props.location.state.detail.city ? props.location.state.detail.city : null}</h3>  

    <Dialog open={open.dialog} onClose={handleClose} 
    className='calendar-modal'
    aria-labelledby="form-dialog-title">
            
        <DialogContent>
          
           <p>Please provide your desired trip duration.</p>
          
          <h3>{currentBooking ? `Start Time: ${currentBooking.hour}:00h` : null}</h3>
      
          </DialogContent>
          <FormControl >
        <Select
        className='calendar-select'
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={drop}
          onClose={closeDrop}
          onOpen={openDrop}
          value={currentBooking ? currentBooking.duration : 0}
          onChange={(event) => setDuration(event.target.value)}
        >
          <MenuItem value={0}>
           
          </MenuItem>
          <MenuItem value={0}>Duration</MenuItem>
          <MenuItem value={2}>Two Hours</MenuItem>
          <MenuItem value={4}>Four Hours</MenuItem>
          <MenuItem value={6}>Six Hours</MenuItem>
          <MenuItem value={8}>Eight Hours</MenuItem>
        </Select>
      </FormControl>
     
       
        <DialogActions>
          {currentBooking.next ? <Button onClick={() => onNext()} color="primary">Next</Button> : null}
        </DialogActions>
      </Dialog>
    </div>



     {/* snackbar update */}
<div className={open.class}>


     <Snackbar
      open={open.snackbar}
      onClose={handleClose}
      TransitionComponent={transition}
      message={message}
      key={transition ? transition.name : ''}
    />
    </div>
   </>
  );
}

export default Bookings;
