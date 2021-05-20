import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function NavBar(props) {

  const history = useHistory();
  
  const [windowState, setWindow] = React.useState({
    anchor: false,
  })

  const [anchorEl, setAnchorEl] = React.useState(null);
 
  const [previous, setPrevious] = useState({
    history: []
  });


//PWA UI

const [os, setOS] = useState('Mobile');

const opSys = () => {

  var userAgent = navigator.userAgent;

  if (/android/i.test(userAgent)) {
    return "Android";
}

  if (/iPhone/.test(userAgent) && !window.MSStream) {
    return "iOS";
}

 return 'Mobile'
}


const PWA = () => {

  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

  const supportedOS = /Android/.test(navigator.userAgent) || /iPhone/.test(navigator.userAgent);

   if(!isInstalled && supportedOS){
  
    const os = opSys();
    sessionStorage.setItem('locals-os', os);
    setOS(os);

   }
  }

  



  useEffect(() => {

    PWA();

    setPrevious(prev => ({
      history: [...prev.history, history.location.pathname]
    }))
    
  
    },[history.location.pathname]);

   

  const refresh = () => {
    handleClose();
    return history.push('/'),[history];
    
  }

 
  const openLogin = () => {
   
    handleClose();
    return history.push('/login'),[history];
  }

  const openEdit = () => {
    
    handleClose();
    return history.push('/edit'),[history];
  }

  const openSchedule = () => {
    
    handleClose();
    return history.push('/scheduler'),[history];
  }

  const openPwa = () => {
    handleClose();
    return history.push('/pwa'),[history];
  }


  const openInbox = () => {
    handleClose();
    return history.push({
      pathname: '/inbox',
      state: { detail: null }
    }),[history];
  }
 


  const openMenu = (event) => {

    setAnchorEl(event.currentTarget);
    setWindow((prev) => ({
      ...prev,
      anchor: true,
    }));
  };

  const handleClose = () => {
    setWindow({
      anchor: false,
    })
  };

 
  const onBack = () => {
   let path = previous.history[previous.history.length - 2];
   path = !path || path === '/chat' ? '/' : path;
  
    return history.push({
      pathname: path,
      state: { detail: null }
    }),[history];
  }

const contactUs = () => {
  window.location.href = "mailto:locals.app@gmail.com?subject=Enquires @ Locals App&body=How can we help?";
}
  

 const uid = localStorage.getItem('locals-uid');

 const isInn =  <div>
   {uid ? <AccountCircleIcon fontSize='large' aria-controls="simple-menu" 
      aria-haspopup="true" 
      onClick={openMenu}
      /> : <p onClick={() => openLogin()}>login</p>}
 </div>

  return (
    <>
    <div className='divider'></div>
    <section className="nav">
      <div className='nav-inner'>
      <div className='top-bar'>
      <div className='nav-logo' >
        {props.logo 
        ? <DynamicFeedIcon onClick={() => refresh()}/> 
        : <ArrowBackIosIcon onClick={() => onBack()}/>}
      </div>

      <h3 className='nav-title'>{props.title ? props.title : null}</h3>
      <div className='nav-icon'>

      {props.nav ? isInn : null}  
      
      </div>
     
      </div>
    
      </div>
    </section>

    <div>
      
      <Menu
        id="simple-menu"
        className='menuModal'
        anchorEl={anchorEl}
        keepMounted
        open={windowState.anchor}
        onClose={handleClose}
      >
        <MenuItem onClick={() => openInbox()}><p>Inbox</p></MenuItem>
        <MenuItem onClick={() => openEdit()}><p>Profile</p></MenuItem>
        <MenuItem onClick={() => openSchedule()}><p>Schedule</p></MenuItem>
        <MenuItem onClick={() => openPwa()}><p>{`${os} App`}</p></MenuItem>
        <MenuItem onClick={() => contactUs()}><p>Contact Us</p></MenuItem>
        
        
      </Menu>
    </div>

   
    </>
  );
}

export default NavBar;
