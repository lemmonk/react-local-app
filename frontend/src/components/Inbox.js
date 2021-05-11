
import React, {useState, useEffect, useContext } from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import InboxCard from './InboxCard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import NavBar from './NavBar';



function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}


function Inbox(props) {

  const {user} = useContext(UserContext);
  const history = useHistory();
  const [inbox, setInbox] = useState(null);
  const [identifier, setIdentifier] = useState(null);
  const [refresh, setRefresh] = useState(false);


  
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if(!user)return history.push('/'),[history];
    
   
    const input = {
      id: user.public_key
    }
  
    axios.post(`/api/inbox/get`, {input})
    .then(res => {
    // console.log(res.data)
      setInbox(res.data);

    })
    .catch(err => {
      console.log(err);
    });

  },[refresh]);


  const confirmDelete = () => {

    const input = {
      id: identifier,
      email: user.email,
      uid: localStorage.getItem('locals-uid')
    }
   
    axios.post(`/api/inbox`, { input })
    .then(res => {
    // console.log(res.data)

    if(res.data.length > 0){
      triggerUseEffect();

      const msg = "Booking deleted!";
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

  const openConfirm = id => {
    setOpen((prev) => ({
      ...prev,
      dialog:true,
      snackbar:false
    }));
    setIdentifier(id);
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




const inboxCard = inbox ? inbox.map((box, index) => {

  let style = 'inbox-card-wrapper';
  let status = 'Travelling';
  let image = box.host_img;
  let name = `${box.host_first_name} ${box.host_last_name}`;
  let city = box.host_city;

  let f_keys = {
   
    host_key: box.user_key,
    user_key: box.host_key
  }

 if(box.host_key === user.public_key){
    style = 'inbox-card-wrapper-host';
    status = 'Hosting';
    image = box.user_img;
    name = box.user_name;
    city = box.host_city;

    f_keys = {
     
      host_key: box.host_key,
      user_key: box.user_key
    }
 } 




  return (
    <InboxCard
    key={index}
    id={box.id}
    style={style}
    image={image}
    name={name}
    city={city}
    status={status}
    date={box.start_time.substring(0,10)}
    start={`${box.start_time.substring(11,16)}h`}
    end={`${box.end_time.substring(11,16)}h`}
    f_keys={f_keys}
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
const inboxReady = inbox ? inboxCard : null;

  return (
    <section >

 

    {searchedCard ? searchedCard : inboxReady}

     <Dialog className='search-dialog' open={open.dialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking?  This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => confirmDelete()} color="primary">
            Delete
          </Button>
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
   
    </section>
  );
}

export default Inbox;
