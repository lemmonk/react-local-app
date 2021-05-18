const express = require('express');
const router = express.Router();
const {
	getChat,
	createChat,
	updateChat,
} = require('../../db/queries/chat-queries');

router.post('/', (req, res) => {
const input = req.body.input;
const values = [input.host_key, input.user_key];

	getChat(values)
	.then((data) => {

		if(data.length > 0){
		
		return res.json(data)
		}

	const vals = [input.host_key, input.user_key, 'Locals App', 'This is the beginning of your direct message history.'];
	
	createChat(vals)
	.then((data) => res.json(data))

		})
		.catch((err) => console.log('Error at chat GET route "/"', err));
});


router.patch('/', (req, res) => {


	const msg = req.body.msg;
	const values = [msg.host_key, msg.user_key, msg.name, msg.message];

		updateChat(values)
		.then((data) => res.json(data))
			.catch((err) => console.log('Error at chat PATCH route "/"', err));
	});

module.exports = router;
