import React, { useState } from 'react';
// import axios from "axios";
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


function Search(props) {

  const [query, setQuery] = useState('')
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('city');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const openSearch = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <section >
    <div className='search-icon-wrapper'>
      <div className='search-icon-inner'>
    <div className='search-icon' onClick={() => openSearch()}>
      <SearchIcon
      fontSize='large'
      />
      </div>
    </div> 
    </div>
   


    <div>
      
      <Dialog className='search-dialog' open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        
        <DialogContent>
          <DialogContentText>
            Find host by location, name, and sorted results.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Search"
            type="search"
            variant='outlined'
            fullWidth

            value={query ? query : ''}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className='search-radio'>

            <FormControl component="fieldset" >
      <FormLabel component="legend">Sort By</FormLabel>
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
        <FormControlLabel value="city" control={<Radio />} label="Hometown" />
        <FormControlLabel value="rating" control={<Radio />} label="Rating" />
        <FormControlLabel value="low" control={<Radio />} label="Price (low)" />
        <FormControlLabel value="high" control={<Radio />} label="Price (high)" />
       
      </RadioGroup>
    </FormControl>
    </div>
        </DialogContent>
        <DialogActions onClick={() => handleClose()}>
         
          <Button onClick={() => props.search(query, value)} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </section>
    
  );
}

export default Search;
