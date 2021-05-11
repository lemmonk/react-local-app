const nodemail = require('./mailer');

const methods = {};

  methods.sendConfirmation = async (details) => {

  const subject = "Locals Confirmation";

  const params = `?i=${details.public_key}`;
  const link = `http://localhost:3000/confirm${params}`;

  const body = `Hello ${details.name}, please follow this <a href=${link}>link</a> to confirm your account and start using the Local's app.`;
  
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
    const link = `http://localhost:3000/recover${params}`;
  
    const body = `Hello ${details.email}, we have recently recieved a request to reset your Local's App password.  If this was not you please file a report by replying to this email, otherwise follow this <a href=${link}>link</a> to proceed.`;
    
    try{
    await nodemail.letter(details.email, details.email, subject, body);
      console.log("email sent");
    } catch(err) {
      console.log('Failed to send invite: ', err);
    
    }
  
    }


 module.exports = methods;

