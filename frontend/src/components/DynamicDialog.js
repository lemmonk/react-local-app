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
<section className="dialog-wrapper">

<Dialog
        className='dialog-inner'
        open={open}
        onClose={() => props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        
        <div className='dialog-content'>
        {props.content}
        </div>
       
       
        <DialogActions onClick={() => props.close()}>
         
          <Button onClick={() => props.action()} color="primary" autoFocus>
            Next
          </Button>
        </DialogActions>
      </Dialog>
   
</section>
  );
}

export default DynamicDialog;
