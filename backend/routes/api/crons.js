const express = require('express');
const router = express.Router();
const nodemail = require('./mailingService/confirmation');


const {
  getRatingCron,
  updateBookingStatus
} = require('../../db/queries/cron-queries');


router.get('/', (req, res) => {

	getRatingCron()
		.then((data) => {
      // console.log(data);

      try {
          
        for (const d of data){

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
            nodemail.sendRating(details);
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
            nodemail.sendRating(details);
          }

        }

      



        return res.json(data);
      } catch (error) {
        console.log(error)
        return res.json(false);
      }


      res.json(data[0].id)
    })
		.catch((err) => console.log('Error at cron GET ratings route "/"', err));
});



module.exports = router;