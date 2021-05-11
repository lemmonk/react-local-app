const db = require('../../lib/db.js');

const getChat = values => {
	
	const text = `
	SELECT id, name, message, stamp 
	FROM chat
	WHERE chat.host_key = $1
	AND chat.user_key = $2
	OR chat.host_key = $2
	AND chat.user_key = $1
	ORDER BY id DESC`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at chat queries 'getChat'`, err));
};

const createChat = values => {
	
	const text = `
	INSERT INTO chat
	(host_key, user_key, name, message) 
	VALUES($1, $2, $3, $4)
	RETURNING *`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at chat queries 'createChat'`, err));
};


const updateChat = values => {
	
	const text = `
	INSERT INTO chat
	(host_key, user_key, name, message) 
	VALUES($1, $2, $3, $4)
	RETURNING id, host_key, user_key, name, message, stamp`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at chat queries 'createChat'`, err));
};


module.exports = {
	getChat,
	createChat,
	updateChat,

};
