const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {
	getInbox,
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
		.catch((err) => console.log('Error at inbox GET route "/"', err));
});


router.post('/', (req, res) => {

	const input = req.body.input;

	validateUser([input.email])
	.then((data) => {

			bcrypt.compare(input.uid, data.uid, function(err, result) {
				
				if(result){
				
					deleteInboxItem([input.id])
					.then((data) => res.json(data))

				} else {
					
					return res.json(false);
				}

			});

		})

	.catch((err) => console.log('Error at inbox GET route "/"', err));
		
});

module.exports = router;
