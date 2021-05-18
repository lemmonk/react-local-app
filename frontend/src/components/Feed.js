import React, { useEffect, useState} from 'react';
import axios from "axios";
import HostCard from "./HostCard";
import Search from "./Search";
import Loading from "./Loading";

function Feed() {

 const [loading, setLoading] = useState(true);
 const [feed, setFeed] = useState({
    hosts: null,
  })

  const [refresh, setRefresh] = useState(false);


  const onSearch = (query, sort) => {
  
    sessionStorage.setItem('locals-search-query', query);
    sessionStorage.setItem('locals-search-sort', sort);
   
    if(refresh){
      setRefresh(false)
    } else {
      setRefresh(true)
    }
  }

 

  useEffect(() => {

    const exist = sessionStorage.getItem('locals-search-query');
    const search = exist ? exist : '';
    const sort = sessionStorage.getItem('locals-search-sort');
   
    const query = {
      search: search,
      sortBy: sort
    }
    setLoading(true);

    axios.post(`/api/hosts`, {query})
    .then(res => {

    // console.log(res.data)

    const result = query.sortBy === 'low' ? res.data.reverse() : res.data;
   
    setFeed({
      hosts: result
    })
    
    setLoading(false);

    })
    .catch(err => {
      console.log(err);
    });
  
    },[refresh]);

   
    
    const hostCard = feed.hosts ? feed.hosts.map((host, index) =>{
      const total = host.thumbs_up + host.thumbs_down;
      let rating = Math.ceil(host.thumbs_up / total * 100);
      rating = Number.isNaN(rating) ? 0 : rating;
    

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
          />
        )
      }
     
    ) : null;


 const setResults = () => {

  let results = null;
  const isQuery = sessionStorage.getItem('locals-search-query');
  const isSorted = sessionStorage.getItem('locals-search-sort');
  let query = isQuery ? sessionStorage.getItem('locals-search-query') : null;
  let sort = !isSorted || isSorted === 'city' ? 'location' : 'price';

  if(isQuery){
    results = `Showing results for ${query} by ${sort}.`;
  } else {
    results = `Showing host results by ${sort}.`;
  }
  return results;
}

const uid = localStorage.getItem('locals-uid');
const results = uid ? setResults() : null;




 
  return (
    <section className="feed">
     {loading ? <Loading/> : null}

     <div className='results-blurb'>{feed.hosts ? results : null}</div>
      {hostCard}
      <Search search={onSearch}/>
    </section>
  );
}

export default Feed;
