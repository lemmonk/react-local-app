import React, { useEffect, useState, useContext} from 'react';
import axios from "axios";
import HostCard from "./HostCard";
import Loading from "./Loading";
import { useHistory } from 'react-router-dom';
import  UserContext  from './UserContext';

function InboxInfo(props) {

const {user} = useContext(UserContext);
const history = useHistory();

 const [loading, setLoading] = useState(true);
 const [info, setInfo] = useState(null)


 
  useEffect(() => {
    window.scrollTo(0, 0);
    let input = null;
    if(user.public_key === props.location.state.detail.host_key){
      input = props.location.state.detail.user_key;
    } else {
      input = props.location.state.detail.host_key;
    }

    if(!input){
    return history.push('/'),[history];
    }
  

    setLoading(true);
    axios.post(`/api/inbox/info`, {input})
    .then(res => {

    // console.log(res.data)

   setInfo(res.data);
    
    setLoading(false);

    })
    .catch(err => {
      setLoading(false);
      //silent error
      console.log(err);

    });
  
    },[]);

   
    
    const infoCard = info ? info.map((inn, index) =>{
      
      const total = inn.thumbs_up + inn.thumbs_down;
      let rating = 0;
      if(total > 10){
      rating = Math.ceil(inn.thumbs_up / total * 100);
      rating = Number.isNaN(rating) ? 0 : rating;
      }
      

        return (
          <HostCard
          key={index}
          public_key={inn.public_key}
          image={inn.image}
          name={`${inn.first_name} ${inn.last_name}`}
          email={inn.email}
          city={inn.city}
          day_rate={null}
          bio={inn.bio}
          social_link={inn.social_link}
          rating={rating}
          connect_id={inn.connect_id}
          customer_id={inn.customer_id}
          action={false}
          />
        )
      }
     
    ) : null;






 
  return (
    <section className="feed">
     {loading ? <Loading/> : null}

     {infoCard}
     
    </section>
  );
}

export default InboxInfo;
