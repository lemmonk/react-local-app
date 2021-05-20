const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const nodemail = require('./mailingService/confirmation');


const {
	updateHostRef,
	updateUserRef,
	updateUserRating,
} = require('../../db/queries/rating-queries');


router.post('/host', (req, res) => {

	const input = req.body.input;
	const values = [input.id, input.ref];
	
	updateHostRef(values)
		.then((data) => {
	updateUserRating([data.user_key], input.rating)
		.then((data) => {
			// console.log('DATA_1',data);

			return res.json(true);
		})
	
			
		})
		.catch((err) => {
			console.log("CATCH ERR HOST RATING");
			return res.json(false);
		});
});


router.post('/user', (req, res) => {

	const input = req.body.input;
	const values = [input.id, input.ref];
	
	updateUserRef(values)
		.then((data) => {
	updateUserRating([data.host_key], input.rating)
		.then((data) => {
				// console.log('DATA_2',data);

				return res.json(true);
			})
	
			
		})
		.catch((err) => {
			console.log('CATCH ERROR USER RATING');
			return res.json(false);
		})
});

module.exports = router;
