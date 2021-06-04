import React, { useContext, useState } from 'react';
import globals from '../globals';
import {useHistory} from 'react-router-dom';
import LinkIcon from '@material-ui/icons/Link';
import StarIcon from '@material-ui/icons/Star';
import UserContext from './UserContext';

import Dialog from '@material-ui/core/Dialog';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import RoomIcon from '@material-ui/icons/Room';


function HostCard(props) {

const {user} = useContext(UserContext);
const history = useHistory();

const openCalendar = info => {
  window.scrollTo(0, 0);
  if(!user)return history.push('/create'),[history];

  if(user && user.public_key === hostInfo.public_key){
    return history.push('/scheduler'),[history];
  }

  return history.push({
    pathname: '/bookings',
    state: { detail: info }
  }),[history];

}

const onSocialLink = address => {
 
    window.open(address);
  
}

const rating =  <div>
<StarIcon className={props.rating > 84 ? 'star-lite' : 'star-dim'}/>
<StarIcon className={props.rating > 74 ? 'star-lite' : 'star-dim'}/>
<StarIcon className={props.rating > 64 ? 'star-lite' : 'star-dim'}/>
<StarIcon className={props.rating > 54 ? 'star-lite' : 'star-dim'}/>
<StarIcon className={props.rating > 14 ? 'star-lite' : 'star-dim'}/>
</div>


const hostInfo = {
  name: props.name,
  email: props.email,
  city: props.city,
  image: props.image,
  price: props.day_rate,
  connect_id: props.connect_id,
  customer_id: props.customer_id,
  public_key: props.public_key
}


const [open, setOpen] = useState(false);
const [map, setMap] = useState(null);
const onCity = city => {
  
  setMap(`https://www.google.com/maps/embed/v1/place?key=${globals().map}=${city}`);

  setOpen(true);
}

const closeMap = () => {
  setOpen(false);
}

const [imgLoaded, setImageLoaded] = useState({
  loaded: 'host-img-loading',
  class: 'init-host-img',
  img: '/images/user.png',
});
const onImgLoaded = () => {
  
  setImageLoaded({
    loaded: 'host-img',
    class: 'loaded-host-img',
    img: props.image ? `${globals().server}${props.image}`: '/images/user.png'
  });
}



const link = props ? props.social_link : null;

  return (
    <section className='host-card-wrapper'>

      <div className='host-card'>
       {link ?  <LinkIcon className='link-icon' fontSize='large' onClick={() => onSocialLink(props.social_link)}/>: null}
        <div className='host-wrapper'>
        <div className='host-header'>
        <div className='host-header-left'>
        <div className={imgLoaded.loaded}>
        <img className={imgLoaded.class} src={imgLoaded.img} alt='locals' onLoad={() => onImgLoaded()} />
        </div>
       

        </div>
        <div className='host-header-left'>
        <h2>{props.name}</h2>
        <div className='host-city'>
        <RoomIcon className='host-map-icon'
        fontSize='default'
        />
        <p  onClick={() => onCity(props.city)}>{props.city ? props.city : 'n/a'}</p>
        </div>

        {props.day_rate ? 
        <div className='host-hourly'>
    
            <AttachMoneyIcon className='host-hourly-icon'
            fontSize='default'
            />
            <p>{`${props.day_rate}/hour`}</p>
        </div>
       : null}

        </div>
      </div>

      
      <div className='host-body'>
      
          <p>{props.bio ? props.bio: '⛔️ No additional info has been provided.'}</p>
      </div>

      <div className='host-footer'>
       {props.rating < 1 ? 'No rating available' : rating}
      </div>

     
      </div>
      {props.action ? 
      <button onClick={() => openCalendar(hostInfo)}>Availability</button>
      :null}
      </div>
     

      <Dialog
       maxWidth='xs'
        className='map-dialog'
        open={open}
        onClose={() => closeMap()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        
        <div className='dialog-map-img'>
      
        <iframe    
          src={map}>
        </iframe>
        </div>
       
       
        
      </Dialog>
     
    </section>
  );
}

export default HostCard;
