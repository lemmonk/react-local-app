const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const nodemail = require('./mailingService/confirmation');


const {
	getBookings,
	createBooking,
	blockBooking,
	fetchBooking,
	deleteBooking,
	updateBookingsRating,
} = require('../../db/queries/booking-queries');

const {
	validateUser,
} = require('../../db/queries/user-queries');


router.post('/get', (req, res) => {

	const input = req.body.input;
	const values = [input.id];
	getBookings(values)
		.then((data) => res.json(data))
		.catch((err) => console.log('Error at bookings GET route "/"', err));
});

router.post('/', (req, res) => {

	
	const booking = req.body.input;

	validateUser([booking.user_email])
	.then((data) => {

			bcrypt.compare(booking.uid, data.uid, function(err, result) {
				
				if(result){
					const host_rate_ref = uniqid();
					const user_rate_ref = uniqid();
					const values = [booking.host_key, booking.host_name, booking.host_email, booking.host_city, booking.user_key, booking.user_name, booking.user_email, booking.user_city, booking.status, booking.amount, booking.title, booking.color, booking.start, booking.end, host_rate_ref, user_rate_ref, booking.stamp];

					createBooking(values)
					.then((data) => {
				
					try {
						
						const details = {
						
							host_name: data.host_name,
							host_email: data.host_email,
							user_name: data.user_name,
							user_city: data.user_city,
							date: data.start_time
						}
					
			
						if(data.id){
							nodemail.sendBooking(details)
						}



						return res.json(data);
					} catch (error) {
						console.log(error)
						return res.json(false);
					}
				
					})

				} else {
					
					return res.json(false);
				}

			});

		})
	
		.catch((err) => console.log('Error at booking POST route "/"', err));
});



router.post('/block', (req, res) => {

	const booking = req.body.input;

	validateUser([booking.user_email])
	.then((data) => {

			bcrypt.compare(booking.uid, data.uid, function(err, result) {
				
				if(result){
				
					const values = [booking.host_key, booking.user_key, booking.status, booking.title, booking.color, booking.start, booking.end, booking.stamp];

					blockBooking(values)
					.then((data) => {
						

						return res.json(data);
					})

				} else {
					
					return res.json(false);
				}

			});

		})
	
		.catch((err) => console.log('Error at booking POST route "/"', err));
});

router.post('/multi', (req, res) => {

	const arr = [];
	for (const day of req.body.days){
	const booking = day;

	validateUser([booking.email])
	.then((data) => {

			bcrypt.compare(booking.uid, data.uid, function(err, result) {
				
				if(result){
				
					const values = [booking.host_key, booking.user_key, booking.title, booking.color, booking.start, booking.end, booking.stamp];

					blockBooking(values)
					.then((data) => {
						console.log(data);
						arr.push(data)
					})

				} else {
					
					return res.json(false);
				}

			});

		})
	
		.catch((err) => console.log('Error at users booking POST route "/"', err));

	} // end of for loop 

	return res.json(arr);
});


router.post('/single', (req, res) => {

	const booking = req.body.input
	validateUser([booking.email])
	.then((data) => {

			bcrypt.compare(booking.uid, data.uid, function(err, result) {
				
				if(result){
				
					const values = [booking.id];

					fetchBooking(values)
					.then((data) => res.json(data))

				} else {
					
					return res.json(false);
				}

			});

		})
	
		.catch((err) => console.log('Error at users booking POST route "/"', err));

});


router.post('/delete', (req, res) => {

	const booking = req.body.input
	validateUser([booking.email])
	.then((data) => {

			bcrypt.compare(booking.uid, data.uid, function(err, result) {
				
				if(result){
				
					const values = [booking.id];

					deleteBooking(values)
					.then((data) => res.json(data))

				} else {
					
					return res.json(false);
				}

			});

		})
	
		.catch((err) => console.log('Error at users booking POST route "/"', err));

});




router.post('/rating', (req, res) => {

	const input = req.body.input;
	const values = [input.id, input.ref];
	console.log('vals', values);
	
	updateHostRef(values)
		.then((data) => {
	updateUserRating([data[key], input.rate])
		.then((data) => {


				console.log(data);
			})
	
			
		})
		.catch((err) => console.log('Error at bookings GET route "/"', err));
});

module.exports = router;
