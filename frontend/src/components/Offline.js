import React from 'react';
import {useHistory} from 'react-router-dom';
import RefreshIcon from '@material-ui/icons/Refresh';

function Offline() {

  const history = useHistory();

  const onRefresh = () => {
    return history.push('/'),[history];
  }

 
  return (
<section className="incoming-wrapper">

    <div className='incoming-content'>
    <p>
    No network connection found
    </p>
   <div className='incoming-icons'>
    <RefreshIcon
    onClick={() => onRefresh()}
    fontSize='large'
    />
   </div>
    </div>

</section>
  );
}

export default Offline;
