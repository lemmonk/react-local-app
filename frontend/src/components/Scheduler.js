import React, {useState, useEffect, useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-awesome-calendar';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Loading from './Loading';




function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const bookingColors = {
  blocked: 'black',
  travel: '#9d00ff',
  hosting: '##ff00ae'
}

function Scheduler() {

  const {user} = useContext(UserContext);
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState({
    state: [],
    identifier: user ? user.public_key : null
  });
  
  const [refresh, setRefresh] = useState(false);

  const [currentBooking, setCurrentBooking] = useState({
    ref: null,
    year: null,
    month: null,
    day: null,
    hour: null,
    formattedStartDate: null,
    formattedEndDate: null,
    duration: 0,
    next: false,
    multi_day: []
  })

  const [open, setOpen] = useState({
    dialog: false,
    snackbar: false,
    class: 'calendar-snackbar'
    
  });


  
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
    const h1 = document.querySelectorAll("h1");
    
    const d = new Date();
    const currentMonth = d.getMonth();
    const currentYear = d.getFullYear();
    
    h1[0].style.opacity = '1';
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

    } else if (mode.month  < currentMonth && mode.year <= currentYear){

     return history.push('/edit'),[history]; 

    }


    if (mode && mode.mode === 'dailyMode'){

      allButtons[3].style.display = 'none';
      allButtons[4].style.display = 'none';
     
    }
	};



 
 
  useEffect(() => {
   
    


    if(!user) return history.push('/'),[history];

    uiManipulation(null);

    const input = {
      id: bookings.identifier
    }

    setLoading(true);
    axios.post(`/api/bookings/get`, {input})
    .then(res => {
   
      // console.log(res.data);
      setLoading(false);
      setBookings((prev) => ({
        ...prev,
        state: res.data,
      }));
    })
    .catch(err => {
      setLoading(false);
      return history.push('/'),[history];
    });

  },[refresh]);


  //format booking to be read by calendar component
  const events = bookings ? bookings.state.map((each) =>{

    if(user.public_key !== each.host_key){
      each.color = bookingColors.travel;
      each.title = 'Travelling';
    }

    return {
      id: each.id,
      host_key: each.host_key,
      color: each.color,
      from: each.start_time,
      to: each.end_time,
      title: each.title

    }

  }):  null;



const openCourseOfAction = mode => {

 
  
  if(mode.mode === 'dailyMode'){

    setOpen((prev) => ({
      ...prev,
      dialog:true,
      snackbar: false,
    }))

    setDialog({
      dialog: selectAction,
      action: onNext
    });

    const check = formateStartDate(mode);
    for (const book of bookings.state){

      if(check.substring(0,10) === book.start_time.substring(0,10)){
        handleClose();
      }
    
    }

  }
}




  const openDay = trigger => {

    openCourseOfAction(trigger);
    uiManipulation(trigger);

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
      return  handleSnack(TransitionUp, msg, cc);
    }
  
    if(trig.hour < 7 || trig.hour >= 22){
      const msg = "Bookings cannot be made between the hours of 10pm and 7am.";
      const cc = 'calendar-snackbar-error';
      return  handleSnack(TransitionUp, msg, cc);
    }

    setDialog({
      dialog: selectDuration,
      action: onNext
    });

   formateStartDate(trig)
   setOpen((prev) => ({
    ...prev,
   dialog: true,
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
    return  handleSnack(TransitionUp, msg, cc);
    }
   
      durationArr.push(i);
  }


  const bookedHours = fetchBookedHours();


   for(const hour of bookedHours){

    if(durationArr.includes(hour)){
      const msg = 'Your requested times conflict with an existing booking.';
      const cc = 'calendar-snackbar-error';
      return  handleSnack(TransitionUp, msg, cc);
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



const createBooking = () => {

  const input = {
    host_key: user.public_key,
    user_key: user.public_key,
    user_email: user.email,
    status: 'pending',
    title:'Time Slot N/A',
    color:bookingColors.blocked,
    start: currentBooking.formattedStartDate,
    end: currentBooking.formattedEndDate,
    stamp: currentBooking.formattedStartDate.substring(0,10),
    email: user.email,
    uid: localStorage.getItem('locals-uid')
  }

  axios.post(`/api/bookings/block`, { input }).then((res) => {

    //  console.log(res.data);
    
    triggerUseEffect();
    const msg = 'Saved!'
    const cc = 'calendar-snackbar';
    handleSnack(TransitionUp, msg, cc);
   
     
    }).catch((err) => {
      console.log(err);
      const msg = 'Something went wrong...!';
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
   hour = isNaN(hour) ? '07' : hour;
   const formatDate = `${year}-${month}-${day}T${hour}:00:00+00:00`;
   const endDate = `${year}-${month}-${day}T22:00:00+00:00`;

    
   setCurrentBooking((prev) => ({
     ...prev,
     ref: bookings.identifier,
     year: year,
     month: month,
     day: day,
     hour: Number(hour),
     formattedStartDate: formatDate,
     formattedEndDate: endDate,
     duration: 0,
     next: false
   }));
   return formatDate
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

const fullDaySelected = () => {
  for (const booking of bookings.state){
    if(booking.start_time.includes(currentBooking.start_time)){
     const msg = 'Your selected dates conflict with an existing booking.';
     const cc = 'calendar-snackbar-error';
     return handleSnack(TransitionUp, msg, cc);
   }
 }

 setDialog({
  dialog: unavailableDay,
});

setCurrentBooking((prev) => ({
  ...prev,
  next: true
}));


  setOpen((prev) => ({
    ...prev,
    dialog:true,
    snackbar:false
  }))
}


const multiDaySelected = () => {
  setDialog({
    dialog: unavailableSpan
  });
  setOpen((prev) => ({
    ...prev,
    dialog:true,
    snackbar: false
  }))
}

const multiEndDaySelected = date => {
const split = date.split('-');
const endDay = split[2];

if (endDay < Number(currentBooking.day)){
 const msg = 'End dates must come after your selected start date, as well as fall within the same month';
 const cc = 'calendar-snackbar-error';
return handleSnack(TransitionUp, msg, cc);
}


let multidayArray = [];
const num = Number(endDay) + 1;

for (let i = Number(currentBooking.day); i < num ; i++){

  const day = i > 9 ? i : `0${i}`;
  const start = `${currentBooking.year}-${currentBooking.month}-${day}T07:00:00+00:00`;
  const end = `${currentBooking.year}-${currentBooking.month}-${day}T22:00:00+00:00`;
  
  for (const booking of bookings.state){

    if(booking.start_time.includes(start)){
     multidayArray = [];
     const msg = 'Your selected dates conflict with an existing booking.';
     const cc = 'calendar-snackbar-error';
     return handleSnack(TransitionUp, msg, cc);
   }
 }



  const all = {
    host_key: user.public_key,
    user_key: user.public_key,
    user_email: user.email,
    status: 'pending',
    title:'Time Slot N/A',
    color:bookingColors.blocked,
    start: start,
    end: end,
    stamp: currentBooking.formattedStartDate.substring(0,10),
    email: user.email,
    uid: localStorage.getItem('locals-uid')
  }

 

  multidayArray.push(all);
}

setCurrentBooking((prev) => ({
  ...prev,
  multi_day: multidayArray,
  next: true
}));

}


const createMultiBooking = () => {

  const days = currentBooking.multi_day;

  if(!days){
    const msg = 'Error'
    const cc = 'calendar-snackbar-error';
   return handleSnack(TransitionUp, msg, cc);
  }

    axios.post(`/api/bookings/multi`, { days }).then((res) => {

      console.log(res.data);
      const msg = 'Saved!';
      const cc = 'calendar-snackbar';
      handleSnack(TransitionUp, msg, cc);
      triggerUseEffect();
    
      }).catch((err) => {
        console.log(err);
        const msg = 'Something went wrong 😧';
        const cc = 'calendar-snackbar-error';
      handleSnack(TransitionUp, msg, cc);
    
      });
 
}; 



const [focusedBooking, setFocusedBooking] = useState({});
const onBooking = (id) => {


  for(const book of bookings.state){
  
   if(book.id === id){
    
    setFocusedBooking(book);

    if(book.host_key === book.user_key){
      
      setDialog({
        dialog: removeUnavailable,
      });

      setOpen((prev) => ({
        ...prev,
        dialog: true,
        snackbar:false
      }))

      setCurrentBooking((prev) => ({
        ...prev,
        next: true
      }));

    } else {
   
     
      return history.push({
        pathname: '/inbox',
        state: { detail: book }
      }),[history];

    
    }


    }
  }
}



const deleteBooking = () => {
  
  const input = {
    id: focusedBooking.id,
    email: user.email,
    uid: localStorage.getItem('locals-uid')
  }

  axios.post(`/api/bookings/delete`, { input })
  .then(res => {
  // console.log(res.data)

  if(res.data.length > 0){
    triggerUseEffect();

    const msg = "Marked as available.";
    const cc = 'calendar-snackbar';
    handleSnack(TransitionUp, msg, cc);
   

  } else {
    const msg = "Failed to deleted booking.";
    const cc = 'calendar-snackbar-error'
    handleSnack(TransitionUp, msg, cc);
  
  }

  })
  .catch(err => {
    console.log(err);
  });

}


//modal ui

const handleClose = () => {
  
  setOpen((prev) => ({
  ...prev,
   dialog: false,
   snackbar:false
  }));

  setCurrentBooking((prev) => ({
    ...prev,
   next: false
  }));
};


const [drop, setDrop] = useState(false);

const openDrop = () => {
  setDrop(true);
};

const closeDrop = () => {
  setDrop(false);
};


const [currentDialog, setDialog] = useState({
  dialog: <div key='init' action='next' actionName='Save'></div>,
});

const [message, setMessage] = useState('Updated Successfully.')


const selectAction = <div
key='selectAction'
action='next'
action_name='Save'
>
    <DialogContent>
          <h3>Mark part, full, or multiple days as unavailable.</h3>
       </DialogContent>
</div>

const selectDuration = <div
key='selectDuration'
action='next'
action_name='Save'
>
  <DialogContent>       
  <h3>How long will you be unavailable?</h3>       
 
  </DialogContent>
      
</div>

const unavailableDay = <div
key='unavailableDay'
action='next'
action_name='Save'
>
       <DialogContent>
          
          <h3>Mark the following date as unavailable?</h3>
        <p>{`Date: ${currentBooking.formattedStartDate ? currentBooking.formattedStartDate.substring(0,10) : 'n/a'}`}</p>
       
               
      </DialogContent>
              
</div>

const unavailableSpan = <div
key='unavailableSpan'
action='multi'
action_name='Save'
>
    <DialogContent>
          
   <h3>Please select the span of dates you would like to mark as unavailable.</h3>
        <p>{`Start Date: ${currentBooking.formattedStartDate ? currentBooking.formattedStartDate.substring(0,10) : 'n/a'}`}</p>
          <form  noValidate>
      <TextField
      id="date"
      label="End Date"
      type="date"
      defaultValue={null}
      onChange={(event) => multiEndDaySelected(event.target.value)}
      
      InputLabelProps={{
        shrink: true,
      }}
      />
      </form>
               
              </DialogContent>
              <DialogActions>
                {currentBooking.next ? <Button onClick={() => createMultiBooking()} color="primary">Save</Button> : null}
              </DialogActions>
</div>


const removeUnavailable = 
<div
action='remove'
action_name='Mark as available'
>
          <DialogContent>
          
          <h3>Not Available</h3>
          <p>You have marked this time slot as unavailable.</p>
    
          </DialogContent>
        
</div>


 

 const courseOfAction = course => {

  switch(course) {
    case 'partial':
      handleClose();
      break;
    case 'full':
     fullDaySelected();
      break;
      case 'multi':
      multiDaySelected();
      break;
    default:
      handleClose();
  }
}

//dialog button handler
const onNext = action => {
  

   switch(action) {
    case 'next':
      createBooking();
      break;
    case 'multi':
      createMultiBooking();
      break;
    case 'remove':
      deleteBooking();
    break;
     
    default:
      handleClose();
  }
  }


//snack update

const [transition, setTransition] = React.useState(undefined);

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
   
    <div  className='calendar'>
    
    <Calendar
        events={events}
        onChange={(trig) => openDay(trig)}
        onClickEvent={(trig) => onBooking(trig)}
        onClickTimeLine={(trig) => openTime(trig)}
        />     

<h3>{user ? ` ${user.first_name} ${user.last_name}${user.city? `, ${user.city}`: ''}`: null}</h3> 

{/* dialog  */}

<Dialog open={open.dialog} onClose={handleClose} 
maxWidth='xs'

    className='calendar-modal'
    aria-labelledby="form-dialog-title">

     {currentDialog ? currentDialog.dialog : 'Error'}

      {currentDialog.dialog.key === 'selectAction' ?
      
      <FormControl className='duration-picker'>
      
      <Select
      className='calendar-select'
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={drop}
        onClose={closeDrop}
        onOpen={openDrop}
        value={0}
        onChange={(event) => courseOfAction(event.target.value)}
      >
        <MenuItem value={0}>
        </MenuItem>
        <MenuItem value={0}>Select</MenuItem>
        <MenuItem value={'partial'}>Partial Day</MenuItem>
        <MenuItem value={'full'}>Full Day</MenuItem>
        <MenuItem value={'multi'}>Multi Day</MenuItem>
      </Select>
    </FormControl> : null}

    {currentDialog.dialog.key === 'selectDuration' ?    <FormControl  >
      
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
     </FormControl> : null}

 

     <DialogActions className='alert-action-btn'>
         {currentBooking.next ? <button onClick={() => onNext(currentDialog.dialog.props.action)} >{currentDialog.dialog.props.action_name}</button> : null}
       </DialogActions>

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
    </div>

  );

}

export default Scheduler;
