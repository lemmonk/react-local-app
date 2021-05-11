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
    <section className="loading">
      <div className={classes.root}>
       
      <CircularProgress/>
     
    </div>
    </section>
  );
}

export default Loading;
