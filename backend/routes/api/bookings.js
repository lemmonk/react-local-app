const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {
	getBookings,
	createBooking,
	fetchBooking,
	deleteBooking,
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

	const arr = [];
	for (const day of req.body.days){
	const booking = day;

	validateUser([booking.email])
	.then((data) => {

			bcrypt.compare(booking.uid, data.uid, function(err, result) {
				
				if(result){
				
					const values = [booking.host_key, booking.user_key, booking.name, booking.city, booking.image, booking.title, booking.color, booking.start, booking.end, booking.stamp];

					createBooking(values)
					.then((data) => {
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

module.exports = router;
