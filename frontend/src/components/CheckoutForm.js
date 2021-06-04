import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import {useHistory} from 'react-router-dom';
import  UserContext  from './UserContext';
import Loading from './Loading';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function  CheckoutForm(props) {
 

const {user} = useContext(UserContext);
const history = useHistory();
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
  

 const fetchClientSecret = (event) =>{
  event.preventDefault();

  if(!user || !localStorage.getItem('locals-uid')){
    alert('Invalid credentials');
    return history.push('/'),[history];
  }
  setError(false);
 

  const input = {
    connect_id: props.connect_id,
    customer_id: props.customer_id,
    email: props.email,
    price: props.price
  };

  setLoading(true);
  axios.post(`/api/stripe/secret`, {input})
  .then(res => {
  
   
   handleSubmit(res.data.client_secret);
  })
  .catch(err => {
    setError(true);
    // console.log(err);
  });

 }
   
  

const stripe = useStripe();
const elements = useElements();

 const handleSubmit = async (client_secret) => {
  if (!stripe || !elements) {
    return;
  }

  const result = await stripe.confirmCardPayment(client_secret, {
    payment_method: {
      card: elements.getElement(CardElement),
      billing_details: {
        name: `${user.first_name} ${user.last_name}`,
        email: props.email,
      },
    }
  });

  if (result.error) {
    setError(true);
    setLoading(false);
  
  } else {
   
    // The payment has been processed!
    if (result.paymentIntent.status === 'succeeded') {
     
      props.createBooking();
    }
  }
};

 


  return (
   <>
 {loading ? <Loading/> : null}

    <section className='stripe-form-wrapper'>
    <form onSubmit={fetchClientSecret}> 
       <CardElement options={CARD_ELEMENT_OPTIONS} />
     
      <button disabled={!stripe}>Confirm Booking</button>
      <div className='stripe-error-msg'>
      {error ? <p>card error</p> : null}
      </div>
     
    </form>
    </section>
    
    </>
  
  );
}