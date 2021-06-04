const express = require('express');
const router = express.Router();
const nodemail = require('./mailingService/confirmation');


const {
  getRatingCron,
  updateBookingStatus,
  deleteAllRecovery,
} = require('../../db/queries/cron-queries');


router.get('/ratings', async (req, res) => {

	getRatingCron()
		.then( async (data) => {
     
    if(data.length === 0){
      return res.json();
    }

    for(const d of data){
    
      updateBookingStatus([d.id])
      .then( async (d) => {
    
      try {
          
      
          //send to traveller
          let details = {
            id: d.id,
            ref: d.user_rate_ref,
            type: 'u',
            name: d.host_name,
            email: d.user_email,
            host_city: d.host_city,
          }

          if(d.user_email){
          await nodemail.sendRating(details);
          }

          //send to host
           details = {
            id: d.id,
            ref: d.host_rate_ref,
            type: 'h',
            name: d.user_name,
            email: d.host_email,
            host_city: d.host_city,
          }
       
    
          if(d.host_email){
           await nodemail.sendRating(details);
          }

          

        return res.json();
      } catch (error) {
        console.log(error)
        return res.json(false);
      }
    
    })

  }// end of loop
   
})

		.catch((err) => {
      console.log('error at status update')
      return res.json(false);
    });
  
});



router.get('/recovery', (req, res) => {

	deleteAllRecovery()
		.then((data) => res.json(data))
		.catch((err) => console.log('Error at users GET route "/"', err));
});




module.exports = router;