const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);

let stripe_url = `${process.env.HOST_URL}/connect`;

if (process.env.NODE_ENV === 'production'){
  stripe_url = `${process.env.LIVE_URL}/connect`
}
                   
const {
  connectHost,
  createCustomer,	
} = require('../../db/queries/user-queries');

//fetch users connect details
router.get('/:id', async (req, res) => {

  const id = req.params.id;

  const account = await stripe.accounts.retrieve(id);

    return res.json(account);
})



router.post('/createAccountLink', async (req, res) => {

  const input = req.body.input;

  try {
    
 

  const account = await stripe.accounts.create({
    type: 'express',
    requested_capabilities: ['card_payments', 'transfers'],
    business_name: 'Locals App Host',
    email: input.email,
    legal_entity: {
      business_name: `Local Hosting - ${input.first_name} ${input.last_name}`,
      type: 'individual',
      first_name: input.first_name,
      last_name: input.last_name,
     
    },
    
  });

 
  if(account.id){
   
    const accountLinks = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: stripe_url,
      return_url: stripe_url,
      type: 'account_onboarding',
      
    });

    const customer = await stripe.customers.create(
      {email: input.email},
      {stripeAccount: account.id}
    );

    const values = [account.id, customer.id, input.email]; 

    connectHost(values)
    .then((data) => {
      
      const connectUser = { 
        id: data.connect_id,
        link: accountLinks,
      }
    
      return res.json(connectUser);

    })

  } else {
      return res.json(false);
  }


} catch (error) {
  console.log(error);
  return res.json(false);
}

});


//CREATE PAYMENT INTENT 
router.post('/secret', async (req, res) => {

  const input = req.body.input;

  let customer =  {
    id: input.customer_id
  }
  if(!customer.id){
    customer = await stripe.customers.create(
      {email: input.email},
    );

    createCustomer([customer.id, input.email]);
  }


  const account = await stripe.accounts.retrieve(input.connect_id);
 
  const price = Number(input.price) * 100;
  const fee = Math.ceil(0.12 * Number(price));

  const intent = await stripe.paymentIntents.create({
  payment_method_types: ['card'],
  amount: price,
  currency: 'cad',
  application_fee_amount: fee,
  },{
    stripeAccount: account.id
  // transfer_data: {
  //   destination: account.id, // < ---- account.id
  // },
});

if(intent.client_secret){
 return res.json({client_secret: intent.client_secret});  
} else {
  return(false);
}

});

module.exports = router;