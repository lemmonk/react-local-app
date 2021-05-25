import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function Loading() {
  const classes = useStyles();

  return (
    <section className="loading-wrapper">

      <div className={classes.root}>
      <div className='loading-double-wrap'>
      <div className='loading'>
      <div className='main-loader'></div>
      </div>
      </div>
     
     
     
     
    </div>
    </section>
  );
}

export default Loading;
