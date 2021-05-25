
import React, {useState, useEffect, useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import InboxCard from './InboxCard';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Loading from './Loading';


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}


function Inbox(props) {
 

  const {user} = useContext(UserContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // const [inbox, setInbox] = useState(null);
  const [identifier, setIdentifier] = useState({
    id: null,
    name: null,
    email: null,
  });
  const [refresh, setRefresh] = useState(false);


  const [inbox, setInbox] = useState({
    filter: 'upcoming',
    upcoming: [],
    complete: [],
    cancelled: [],
  });
  
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if(!user)return history.push('/'),[history];
    
  
    const input = {
      id: user.public_key
    }
  
    setLoading(true);
    axios.post(`/api/inbox/get`, {input})
    .then(res => {
    // console.log(res.data)
    setLoading(false);
    
    const upcoming = [];
    const complete = [];
    const cancelled = [];
    for (const item of res.data){

      if(item.status === 'Upcoming'){

       upcoming.push(item);

      } else if(item.status === 'Complete' ){
       
        complete.push(item);

      }else if(item.status === 'Cancelled'){

        cancelled.push(item);
      
      }

    }

    setInbox({
      filter: 'upcoming',
      upcoming: upcoming,
      complete: complete,
      cancelled: cancelled
    })

    setFilterColors({
      upcoming: 'inbox-status-upcoming',
      complete: 'inbox-status-unfocused',
      cancelled: 'inbox-status-unfocused'
    })


    })
    .catch(err => {
      setLoading(false);
      //quiet error
    });

  },[refresh]);



  const confirmDelete = () => {

    const input = {
      id: identifier.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      other_name: identifier.name,
      other_email: identifier.email,
      uid: localStorage.getItem('locals-uid')
    }

    handleClose();
    setLoading(true);
    axios.post(`/api/inbox`, { input })
    .then(res => {
    // console.log(res.data)

    if(res.data == input.id){
      setLoading(false);
      triggerUseEffect();
      const msg = `A cancellation email has been sent to ${input.other_name}.`;
      const cc = 'calendar-snackbar';
     
      handleSnack(TransitionUp, msg, cc);
     

    } else {
      setLoading(false);
      const msg = "Failed to cancel booking.";
      const cc = 'calendar-snackbar-error'
      handleSnack(TransitionUp, msg, cc);

      
    }

    })
    .catch(err => {
      setLoading(false);
      const msg = "Failed to deleted booking.";
      const cc = 'calendar-snackbar-error'
      handleSnack(TransitionUp, msg, cc);
    });
    
  }

  const triggerUseEffect = () => {

    if(refresh){
      setRefresh(false);

    } else {
      setRefresh(true);
    }
  }

  const [message, setMessage] = useState(null);
  const [transition, setTransition] = React.useState(undefined);

  const [open, setOpen] = useState({
    dialog: false,
    snackbar: false,
    class: 'celendar-snackbar'
  });

  const openConfirm = other => {
    setOpen((prev) => ({
      ...prev,
      dialog:true,
      snackbar:false
    }));
    setIdentifier({
      id: other.id,
      name: other.name,
      email: other.email,
    });
  };

  const handleClose = () => {
    setOpen((prev) => ({
      ...prev,
      dialog:false,
      snackbar:false
    }));
  };

  const handleSnack = (Transition,msg,cc) => {

    setMessage(msg);
    setTransition(() => Transition);
  
    setOpen(() => ({
     dialog: false,
     snackbar: true,
     class: cc
    }));
  
    
  
    setTimeout(function () {
      setOpen((prev) => ({
        ...prev,
       snackbar: false
      }));
    }, 5000)
  
  }





const inboxCard = inbox ? inbox[inbox.filter].map((box, index) => {

  let style = 'inbox-card-wrapper';
  let type = 'Travelling';
  let host_image = box.host_image;
  let user_image = box.user_image;
  let host_name = box.host_name;
  let user_name = box.user_name;
  let host_city = box.host_city;

  let other = {
    id: box.id,
    name: box.host_name,
    email: box.host_email,
  }

  let f_keys = {
   
    host_key: box.user_key,
    user_key: box.host_key
  }

 if(box.host_key === user.public_key){
    style = 'inbox-card-wrapper-host';
    type = 'Hosting';
 

    other = {
      id: box.id,
      name: box.user_name,
      email: box.user_email,
    }
   
    f_keys = {
     
      host_key: box.host_key,
      user_key: box.user_key
    }
 } 


 let status_style = 'inbox-status-upcoming';
 if(box.status === 'Cancelled'){
  status_style = 'inbox-status-cancelled';
 } else if (box.status === 'Complete'){
  status_style = 'inbox-status-complete';
 }
 

  return (
    <InboxCard
    key={index}
    id={box.id}
    style={style}
    host_image={host_image}
    host_name={host_name}
    user_name={user_name}
    user_image={user_image}
    city={host_city}
    status={box.status}
    status_style={status_style}
    type={type}
    date={box.start_time.substring(0,10)}
    start={`${box.start_time.substring(11,16)}h`}
    end={`${box.end_time.substring(11,16)}h`}
    f_keys={f_keys}
    other={other}
    open={openConfirm}
    />
  )}
  ) : null;



const isSearched = () => {
 
  if(props.location.state.detail && inboxCard){

    for (const card of inboxCard){

      if(props.location.state.detail.id === card.props.id){
        return card;
      }
    }
  }
  return null;
}


const searchedCard = isSearched();
const inboxReady = inbox ? inbox[inbox.filter].length ? inboxCard : <h3 className='inbox-empty'>Folder Empty</h3> : null;


const [filterColors, setFilterColors] = useState({

  upcoming: 'inbox-status-upcoming',
  complete: 'inbox-status-unfocused',
  cancelled: 'inbox-status-unfocused'
})

const onUpcoming = () => {

  setInbox((prev) => ({
    ...prev,
    filter: 'upcoming'
  }))

  setFilterColors({
    upcoming: 'inbox-status-upcoming',
    complete: 'inbox-status-unfocused',
    cancelled: 'inbox-status-unfocused'
  })

}

const onComplete = () => {

  setInbox((prev) => ({
    ...prev,
    filter: 'complete'
  }))

  setFilterColors({
    upcoming: 'inbox-status-unfocused',
    complete: 'inbox-status-complete',
    cancelled: 'inbox-status-unfocused'
  })
}


const onCancelled = () => {

  setInbox((prev) => ({
    ...prev,
    filter: 'cancelled'
  }))


  setFilterColors({
    upcoming: 'inbox-status-unfocused',
    complete: 'inbox-status-unfocused',
    cancelled: 'inbox-status-cancelled'
  })
}

const filterOptions = <div className='inbox-filter'>
<div className={filterColors.upcoming}>
<p onClick={() => onUpcoming()}>Upcoming</p>
</div>
<div className={filterColors.complete}>
<p onClick={() => onComplete()}>Complete</p>
</div>
<div className={filterColors.cancelled}>
<p onClick={() => onCancelled()}>Cancelled</p>
</div>
</div>

  return (

  <section className='inbox-double-wrap'>
    {loading ? <Loading/> : null}


    {searchedCard ? null : filterOptions}
   
    {searchedCard ? searchedCard : inboxReady}

     <Dialog className='search-dialog' open={open.dialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        
        <DialogContent>
          <h2>Cancel Booking</h2>
          <DialogContentText>
            Are you sure you want to cancel this booking?  This action cannot be undone and will notify the other party of your departure from your agreement. 
            <br></br>
            <br></br>
            All refunds are administrated and therefore the sole responsibility of the acting host.
           
          </DialogContentText>
         <div className='a-refund'>
         <a  href='/terms' target='_blank'>Refund Policy</a>
         </div>
        </DialogContent>
        <DialogActions className='full-length-btn-destroy'>
          <button onClick={() => confirmDelete()} >
            Cancel Booking
          </button>
        </DialogActions>

        <div className='plain-btn'>
          <button onClick={() => handleClose()} >
            No thanks
          </button>
        </div>

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
   
    </section>
  );
}

export default Inbox;
