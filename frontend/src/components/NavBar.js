import React, {useContext, useEffect, useState} from 'react';
import  UserContext  from './UserContext';
import {useHistory} from 'react-router-dom';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function NavBar(props) {

  const history = useHistory();
  
  const [window, setWindow] = React.useState({
    anchor: false,
  })

  const [anchorEl, setAnchorEl] = React.useState(null);
 
  const [previous, setPrevious] = useState({
    history: []
  });

  useEffect(() => {

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

console.log('how can we help?')
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

      <h3>{props.title ? props.title : null}</h3>
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
        open={window.anchor}
        onClose={handleClose}
      >
        <MenuItem onClick={() => openEdit()}>Profile</MenuItem>
         <MenuItem onClick={() => openInbox()}>Inbox</MenuItem>
        <MenuItem onClick={() => openSchedule()}>Schedule</MenuItem>
        
      </Menu>
    </div>

   
    </>
  );
}

export default NavBar;
