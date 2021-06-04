import React, { useEffect, useState, useContext} from 'react';
import useReference from '../hooks/useReference';
import axios from "axios";
import Splash from './Splash';
import HostCard from "./HostCard";
import Search from "./Search";
import Loading from "./Loading";
import  UserContext  from './UserContext';
import { useHistory } from 'react-router-dom';

function Feed() {

 const {user, setUser} = useContext(UserContext);
  
const history = useHistory();
 const [loading, setLoading] = useState(true);
 const [feed, setFeed] = useState({
    hosts: null,
    query: 'at random'
  })

const [refresh, setRefresh] = useState(false);


 useEffect(() => {
    window.scrollTo(0, 0);
    
    const uid = localStorage.getItem('locals-uid');

    if(!user && uid){
    

    axios.post('/api/users/session', { uid })
    .then(res => {
   
      
      if(res.data.verified){
     
        setUser(res.data);


      } else {
       
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
     
      }
      
    })
    .catch(err => {
      console.log(err);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
     

      //silent error
    });
  }

  },[user]);





  const onSearch = (query, sort) => {
    window.scrollTo(0, 0);
    sessionStorage.setItem('locals-search-query', query);
    sessionStorage.setItem('locals-search-sort', sort);
   
    if(refresh){
      setRefresh(false)
    } else {
      setRefresh(true)
    }
  }

 
  const mounted = useReference();
  useEffect(() => {

    if(!mounted)return;

    const exist = sessionStorage.getItem('locals-search-query');
    const search = exist ? exist : '';
    const sort = sessionStorage.getItem('locals-search-sort');
   
    const query = {
      search: search,
      ui: `Showing host results ${exist ? `for ${exist}` : 'at random'}`
    }

    let url = '/api/hosts';
    
    if(sort === 'rating'){
      url = '/api/hosts/rating'
      query.ui = `Showing host results ${query.search ? `for ${query.search}` : ''} by rating`
    } else if (sort === 'low' || sort === 'high'){
      url = '/api/hosts/price'
      query.ui = `Showing host results ${query.search ? `for ${query.search}` : ''} by ${sort}est price`
    }
   

    setLoading(true);
    axios.post(url, {query})
    .then(res => {

    // filter by search results
    const result = sort === 'high' ? res.data.reverse() : res.data;

    setFeed({
      hosts: result,
      query: query.ui
    })
    
    setLoading(false);

    })
    .catch(err => {
      setLoading(false);
      return history.push('/'),[history];

    });
  
    },[refresh]);

   
    
    const hostCard = feed.hosts ? feed.hosts.map((host, index) =>{
     
      const total = host.thumbs_up + host.thumbs_down;
      let rating = 0
      if(total > 10){
       rating = Math.ceil(host.thumbs_up / total * 100);
      rating = Number.isNaN(rating) ? 0 : rating;
      }
      
  
        return (
          <HostCard
          key={index}
          public_key={host.public_key}
          image={host.image}
          name={`${host.first_name} ${host.last_name}`}
          email={host.email}
          city={host.city}
          day_rate={host.day_rate}
          bio={host.bio}
          social_link={host.social_link}
          rating={rating}
          connect_id={host.connect_id}
          customer_id={host.customer_id}
          action={true}
          />
        )
      }
     
    ) : null;


    


const uid = localStorage.getItem('locals-uid');

  return (
    <section className="feed">
     {loading ? <Loading/> : null}
    {!loading && !uid ? <Splash/> : null}

    <div className='results-blurb'>
    {uid && !loading ? feed.query : null}

    </div>
    
      {hostCard ? hostCard : null}
      <Search search={onSearch}/>
    </section>
  );
}

export default Feed;
