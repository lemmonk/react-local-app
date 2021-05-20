const nodemail = require('./mailer');
const brand = 'Locals';
const url = 'http://localhost:3000'

const methods = {};

  methods.sendConfirmation = async (details) => {

  const subject = "Locals Confirmation";

  const params = `?i=${details.public_key}`;
  const link = `${url}/confirm${params}`;

  const body = `Hello ${details.name}, please follow this <a href=${link}>link</a> to confirm your account and start using the ${brand} app.`;
  
  try{
  await nodemail.letter(details.name, details.email, subject, body);
    console.log("email sent");
  } catch(err) {
    console.log('Failed to send invite: ', err);
  
  }

  }


  methods.sendRecovery = async (details) => {

    const subject = "Password Recovery";
  
    const params = `?e=${details.email}&r=${details.uid}`;
    const link = `${url}/recover${params}`;
  
    const body = `Hello ${details.email}, we have recently recieved a request to reset your ${brand} app password.  If this was not you please file a report by replying to this email, otherwise follow this <a href=${link}>link</a> to proceed.`;
    
    try{
    await nodemail.letter(details.email, details.email, subject, body);
      console.log("email sent");
    } catch(err) {
      console.log('Failed to send invite: ', err);
    
    }
  
    }



    methods.sendBooking = async (details) => {

      const subject = "New Booking!";
    
      const body = `Hello ${details.host_name}, you have a new ${brand} app booking.
      <br><br>
      Guest: ${details.user_name}
      <br>
      From: ${details.user_city ? details.user_city : 'N/A'}
      <br>
      On: ${details.date.substring(0,10)} @ ${details.date.substring(11,16)} hours.
      <br><br> 
      Please see your <a href=${url}>inbox</a> for further details and to communicate with your client.`;
      
      try{
      await nodemail.letter(details.host_name, details.host_email, subject, body);
        console.log("email sent");
      } catch(err) {
        console.log('Failed to send invite: ', err);
      
      }
    
      }



      methods.sendCancellation = async (details) => {

        const subject = `${brand} Booking Cancelled`;
      
        const body = `Hello ${details.to}, the following ${brand} app booking has been cancelled by ${details.from}.
        <br><br>
        Host: ${details.host_name}<br>
        Guest: ${details.user_name}<br>
        In: ${details.host_city}<br>
        ${details.date} @ ${details.start}h - ${details.end}h.
        <br><br>
        Please see your <a href=${url}>schedule</a> to view the changes.
        <br><br>
        - ${brand}`;
        
        try{
        await nodemail.letter(details.to, details.email, subject, body);
          console.log("email sent");
        } catch(err) {
          console.log('Failed to send invite: ', err);
        
        }
      
        }


        methods.sendRating = async (details) => {

          const subject = "Locals - Rate Your Experience";
        
          const params = `?i=${details.id}&r=${details.ref}&t=${details.type}`;
          const link_y = `${url}/rating${params}&rate=thumbs_up`;
          const link_n = `${url}/rating${params}&rate=thumbs_down`;
        
          const body = `
          <div style='text-align:center; line-height: 1.5; margin-top:25px;' >
          <h3>  
          Rate your experience with ${details.name} in ${details.host_city}.
          <br><br>
         <div style='font-size: 2rem'>
          <a href=${link_y}>👍</a> | <a href=${link_n}>👎</a> 
          </div>
          <br><br>
          <br><br>
          Thank you for using ${brand}.
          </h3>
          </div>`;
          
          try{
          await nodemail.letter(subject, details.email, details.name, body);
            console.log("email sent");
          } catch(err) {
            console.log('Failed to send invite: ', err);
          
          }
        
          }


 module.exports = methods;

