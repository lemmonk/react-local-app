import React, { useContext } from 'react';
import {useHistory} from 'react-router-dom';
import LinkIcon from '@material-ui/icons/Link';
import StarIcon from '@material-ui/icons/Star';
import UserContext from './UserContext';

function HostCard(props) {
const server = 'http://localhost:8080/images/'; //<-- TEMP

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
  city: props.city,
  image: props.image,
  public_key: props.public_key
}

const link = props ? props.social_link : null;

  return (
    <section className='host-card-wrapper'>

      <div className='host-card'>
       {link ?  <LinkIcon className='calendar-icon' onClick={() => onSocialLink(props.social_link)}/>: null}
        <div className='host-wrapper'>
        <div className='host-header'>
        <div className='host-header-left'>
        <img src={props.image ? `${server}${props.image}`: '/images/user.png'} alt='img'/>
        </div>
        <div className='host-header-left'>
        <h3>{props.name}</h3>
        <h3>{props.city}</h3>
        <h3>{`$${props.day_rate}/hour`}</h3>
        </div>
      </div>

      
      <div className='host-body'>
      
          <p>{props.bio}</p>
      </div>

      <div className='host-footer'>
       {props.rating < 15 ? 'No rating available' : rating}
      </div>


      </div>
      <button onClick={() => openCalendar(hostInfo)}>Availability</button>
      </div>

     
     
    </section>
  );
}

export default HostCard;
