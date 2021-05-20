import React, {useState, useEffect, useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import globals from '../globals';
import Calendar from 'react-awesome-calendar';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';


import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}


const bookingColors = {
  blocked: 'black',
  travel: '#9d00ff',
  hosting: '#45bdfe'
}

function Bookings(props) {
  



  const {user} = useContext(UserContext);
  const history = useHistory();
  const [bookings, setBookings] = useState({
    state: [],
    identifier: props.location.state.detail.public_key,
  });

  const [currentBooking, setCurrentBooking] = useState({
    ref: null,
    title: 'Hosting Booked',
    color: bookingColors.hosting,
    year: null,
    month: null,
    day: null,
    hour: null,
    formattedStartDate: null,
    formattedEndDate: null,
    duration: 0,
    next: false,
    stripePromise: loadStripe(globals().stripe,{
      stripeAccount: props.location.state.detail.connect_id
    })
  })

  const [refresh, setRefresh] = useState(false);

  const highlightLocalDay = (mode) => {
  
    const d = new Date();
    const currentDay = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    const sameMonth = mode && Number(mode.month) <= month;
    const sameYear = mode && Number(mode.year) <= year;
    const allSpans = document.querySelectorAll(".dayText");
   
      for (const span of allSpans){

        if(!mode && span.innerText == currentDay){
          span.classList.add('currentDay');
        
        } else if(sameMonth && sameYear && span.innerText == currentDay){
          span.classList.add('currentDay');
        
        } else {
          span.classList.remove('currentDay');

        }
    }

  }
  
  const uiManipulation = mode => {
    window.scrollTo(0, 0);
    highlightLocalDay(mode);
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
     

    } else if (mode.month - currentMonth > 1){

      allButtons[4].style.display = 'none';
    }


    if (mode && mode.month - currentMonth > 2 || mode &&  mode.month - currentMonth < 0){
      return history.push('/'),[history];
    }


    if (mode && mode.mode === 'dailyMode'){

      allButtons[3].style.display = 'none';
      allButtons[4].style.display = 'none';

    }
   
	};


 
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
      return history.push('/'),[history];
    });

  },[refresh]);

  //format booking to be read by calendar component
  const events = bookings ? bookings.state.map(each =>{

    return {
      id: each.id,
      color: bookingColors.blocked,
      from: each.start_time,
      to: each.end_time,
      title: 'Time slot unavailable...'

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


//STRIPE PAYMENTS

const [pay, setPay] = useState({
 
  price: 0,
  open: false
});

const closePay = () => {
  setPay({
   
    price: 0,
    secret: null,
    open:false
  })
}




const openStripeCheckout = () => {

const duration = Number(currentBooking.duration);
const price = Number(props.location.state.detail.price) * duration;

  setPay((prev) => ({
    ...prev,
   price: price,
   open: true
  }));
  
  setOpen((prev) => ({
    ...prev,
  dialog: false
  }));
}





const createBooking = () => {
 
  const host = props.location.state.detail;

  const input = {
    host_key: host.public_key,
    host_name: host.name,
    host_email: host.email,
    host_city: host.city,
    user_key: user.public_key,
    user_name: `${user.first_name} ${user.last_name}`,
    user_email: user.email,
    user_city: user.city,
    status: 'Upcoming',
    amount: pay.price,
    title:'Hosting',
    color:bookingColors.hosting,
    start: currentBooking.formattedStartDate,
    end: currentBooking.formattedEndDate,
    stamp: currentBooking.formattedStartDate.substring(0,10),
    uid: localStorage.getItem('locals-uid'),
  }


  
  axios.post(`/api/bookings`, { input }).then((res) => {

  if(res.data === false){

    const msg = 'Invaild Credentials';
    const cc = 'calendar-snackbar-error';
   return handleSnack(TransitionUp, msg, cc);
  }

   triggerUseEffect();
   const msg = 'Success! A notification email has been sent to your host.';
   const cc = 'calendar-snackbar';
  handleSnack(TransitionUp, msg, cc);
  
    // console.log(res.data);
    return history.push({
      pathname: '/inbox',
      state: { detail: res.data }
    }),[history];
    
    }).catch((err) => {
      console.log(err);
      const msg = "Something went wrong 😧";
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

// console.log(bookings.stripePromise)
  return (
    
    <>
    
    <div  className='calendar'>
  

    <Calendar
        events={events}
        onChange={(trig) => openDay(trig)}
        onClickTimeLine={(trig) => openTime(trig)}
        />  
 
 <h3>{props ? ` ${props.location.state.detail.name}, ${props.location.state.detail.city}.`: null}</h3> 
     

    <Dialog open={open.dialog} onClose={handleClose} 
    className='calendar-modal'
    aria-labelledby="form-dialog-title">
            
        <DialogContent>
          
           <h3>Please provide your desired trip duration.</h3>
          
          <p>{currentBooking ? `Start Time: ${currentBooking.hour}:00h` : null}</p>
      
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
     <div className='small-divider'></div>
       
        <DialogActions className='alert-action-btn'>
          {currentBooking.next ? <button onClick={() => openStripeCheckout()} >Next</button> : null}
        </DialogActions>

        
        
      </Dialog>

    </div>

  
{/* Stripe element */}
<Dialog open={pay.open} onClose={closePay} 
    
    aria-labelledby="form-dialog-title">
            
        <DialogContent id='stripe-modal'>
        
        <div className='stripe-price-details'>
        <h2>Booking Details</h2>
        {pay.open ? <p>Host: {props.location.state.detail.name}</p> : null}
        {pay.open ? <p>Location: {props.location.state.detail.city}</p>  : null}
       {pay.open ?  <p>Date: {currentBooking.formattedStartDate.substring(0,10)}</p> : null}
       {pay.open ?  <p>Time: {
       `${currentBooking.formattedStartDate.substring(11,16)}h - ${currentBooking.formattedEndDate.substring(11,16)}h`}</p> : null}
       {pay.open ?  <p>Rate: {`${currentBooking.duration} hours @ $${props.location.state.detail.price}`}</p> : null}
        <h3 className='stripe-total'>Total Cost: ${pay.price}</h3>
        </div>


        
          {/* Stripe  */}
      <Elements stripe={currentBooking.stripePromise}>
      <CheckoutForm
      connect_id={props.location.state.detail.connect_id}
      customer_id={user.customer_id}
      email={user.email}
      price={pay.price}
      createBooking={createBooking}
      />
     </Elements>
   
   <div className='secured-by'>
   <p>Transaction secured by <a href='https://stripe.com' target='_blank'>Stripe</a></p> 
   </div>
        
      
          </DialogContent>
         
         
      
      </Dialog>
    

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
