import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


function DynamicDialog(props) {

  const [open, setOpen] = useState(props.open);

  useEffect(() => {

    setOpen(props.open)

  },[props.open]);
 

 

 

 
  return (


<Dialog
         maxWidth='xs'
        open={open}
        onClose={() => props.close()}
        aria-labelledby="alert-dialog-title"
       
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        
        <div className='dialog-content'>
        {props.content}
        </div>
       
       
        <DialogActions className='alert-action-btn' onClick={() => props.close()}>
         
          <button onClick={() => props.action()} color="primary" autoFocus>
            Okay
          </button>
        </DialogActions>
      </Dialog>
   

  );
}

export default DynamicDialog;
