const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemail = require('./mailingService/confirmation');


const {
	getInbox,
	fetchInfo,
	deleteInboxItem,
} = require('../../db/queries/inbox-queries');

const {
	validateUser,
} = require('../../db/queries/user-queries');

router.post('/get', (req, res) => {

	const input = req.body.input;
	const values = [input.id];

	getInbox(values)
		.then((data) => res.json(data))
		.catch((err) => {
			console.log('Error at inbox GET route "/"', err);
			return res.json(false);
		});
});

router.post('/info', (req, res) => {

	const input = req.body.input;
	const values = [input];

	fetchInfo(values)
		.then((data) => res.json(data))
		.catch((err) => {
			console.log('Error at inboxInfo GET route "/"', err);
			return res.json(false);
		});
});


router.post('/', (req, res) => {

	const input = req.body.input;

	validateUser([input.email])
	.then((data) => {

			bcrypt.compare(input.uid, data.uid, function(err, result) {
				
				if(result){
				
					deleteInboxItem([input.id])
					.then((data) => {

						if(!data){
							return res.json(false);
						}

						
						const details = {
							from: input.name,
								to: input.other_name,
						 email: input.other_email,
						
						 host_name: data.host_name,
						 user_name: data.user_name,
						 host_city: data.host_city,
						 date: data.start_time.substring(0,10),
						 start: data.start_time.substring(11,16),
						 end: data.end_time.substring(11,16),
						}
						

						nodemail.sendCancellation(details).then((mail) => {

							if(mail){
								return res.json(data.id);
							} 
							return res.json(false);
			
						})
			
					})

				} else {
					return res.json(false);
				}

			});

		})

	.catch((err) => {
		console.log('Error at inbox GET route "/"', err);
		return res.json(false);
	});
		
});

module.exports = router;
