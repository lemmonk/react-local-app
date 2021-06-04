const nodemail = require('./mailer');
const brand = 'Locals';

let url = process.env.HOST_URL;

if (process.env.NODE_ENV === 'production'){
  url = process.env.LIVE_URL
}

const methods = {};

  methods.sendConfirmation = async (details) => {

  const subject = `${brand} Confirmation`;

  const params = `?i=${details.public_key}`;
  const link = `${url}/confirm${params}`;

  const body = `
  <div style='display:block; margin:auto; line-height:1.6; border:solid 2px lightgray; border-left: solid 4px #1eabf7; border-radius: 5px; padding:2px 0px 2px 15px;'>
  <h3>
   Hello ${details.name}!<br><br>
   We're very excited to welcome you to our network of travellers and host.
  <br> 
  Please follow this <a style='color:#1eabf7' href=${link}>link</a> to
   confirm your account before getting started.
  <br><br> 
  Thank you for choosing ${brand}.
  </h3>
  </div>
  `;
  
 
  try {
   let mail = await nodemail.letter(`${brand} App`, details.email, subject, body);
 
  
     return mail;

  } catch (err) {
    return false;
  }
    

  }


  methods.sendRecovery = async (details) => {

    const subject = "Password Recovery";
  
    const params = `?e=${details.email}&r=${details.uid}`;
    const link = `${url}/recover${params}`;
  
    const body = `
     <div style='display:block; margin:auto; line-height:1.6; border:solid 2px lightgray; border-left: solid 4px #1eabf7; border-radius: 5px; padding:2px 0px 2px 15px;'>
     <h3>
    Hello,<br><br>
    We recently recieved a request to reset your ${brand} app password.
    <br>
      If this was not you please file a report by replying to this email, otherwise follow this <a style='color:#1eabf7' href=${link}>link</a> to proceed with the reset. 
    <br><br> 
    Thank you for choosing ${brand}.
    </h3>
    </div>
    `;
    
    

    try {
      
      let mail = await nodemail.letter(`${brand} App`, details.email, subject, body);
    
      if(mail){
        return mail;
      }
      return mail;
   
     } catch (err) {
       return mail;
     }
  
    }



    methods.sendBooking = async (details) => {

      const subject = "New Booking!";
    
      const body = `
      <div style='display:block; margin:auto; line-height:1.6; border:solid 2px lightgray; border-left: solid 4px #1eabf7; border-radius: 5px; padding:2px 0px 2px 15px;'>
      <h3>

      Hello ${details.host_name}, 
      <br><br>
      You have a new ${brand} app booking!
      <br><br>
      Guest: ${details.user_name}
      <br>
      From: ${details.user_city ? details.user_city : 'N/A'}
      <br>
      On: ${details.date.substring(0,10)} @ ${details.date.substring(11,16)} hours.
      <br><br> 
      Please see your <a style='color:#1eabf7' href=${url}>inbox</a> for further details and to communicate further with your guest.
      <br><br> 
      Thank you for choosing ${brand}.
      </h3>
      </div>
      `;

      
      try {
      
       let mail = await nodemail.letter(`${brand} App`, details.host_email, subject, body);
      
        if(mail){
          return mail;
        }
        return mail;
     
       } catch (err) {
         return mail;
       }
     
    
      }



      methods.sendCancellation = async (details) => {

        const subject = `${brand} Booking Cancelled`;
      
        const body = `
        <div style='display:block; margin:auto; line-height:1.6; border:solid 2px lightgray; border-left: solid 4px #fc5d5d; border-radius: 5px; padding:2px 0px 2px 15px;'>
        <h3>

        Hello ${details.to}, 
        <br><br>
        The following ${brand} app booking has been cancelled by ${details.from}.
        <br><br>
        Host: ${details.host_name}<br>
        Guest: ${details.user_name}<br>
        Location: ${details.host_city}<br>
        ${details.date} @ ${details.start}h - ${details.end}h.
        <br><br>
        Please see your <a style='color:#1eabf7' href=${url}>schedule</a> to view the changes.

        <br><br> 
        Thank you for choosing ${brand}.
        </h3>
        </div>`;

        
        try {
      
          let mail = await nodemail.letter(`${brand} App`, details.email, subject, body);
       
         
           if(mail){
             return mail;
           }
           return mail;
        
          } catch (err) {
            return mail;
          }
       
      
        }


        methods.sendRating = async (details) => {

          const subject = "Locals - Rate Your Experience";
        
          const params = `?i=${details.id}&r=${details.ref}&t=${details.type}`;
          const link_y = `${url}/rating${params}&rate=thumbs_up`;
          const link_n = `${url}/rating${params}&rate=thumbs_down`;
        
          const body = `
          <div style='display:block; margin:auto; line-height:1.6; border:solid 2px lightgray; border-left: solid 4px #1eabf7; border-radius: 5px; padding:2px 0px 2px 15px;'>
          <h3>
          Rate your ${brand} experience with ${details.name} in ${details.host_city}.
          <br><br>
       
          <a style='font-size: 2rem; text-decoration:none;' href=${link_y}>👍</a> or <a style='font-size: 2rem; text-decoration:none;' href=${link_n}>👎</a> 
          <br><br> 
           <br><br> 
          Thank you for choosing ${brand}.
          </h3>
          </div>
          `;

         
    try {
      
      let mail =  await nodemail.letter(`${brand} App`, details.email, details.name, body);
    
      
        if(mail){
          return mail;
        }
        return mail;
    
      } catch (err) {
        return mail;
      }
         
        
          }


 module.exports = methods;

