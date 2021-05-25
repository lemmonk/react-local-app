const db = require('../../lib/db.js');

const updateHostRef = (values) => {
	
	const text = `
	UPDATE bookings
	SET host_rate_ref = $3
	WHERE id = $1
	AND host_rate_ref = $2
	AND host_rate_ref != 'thumbs_up'
	AND host_rate_ref != 'thumbs_down'
	RETURNING user_key;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at host queries 'getBookings'`, err));
};


const updateUserRef = (values) => {
	
	const text = `
	UPDATE bookings
	SET user_rate_ref = $3
	WHERE id = $1
	AND user_rate_ref = $2
	AND user_rate_ref != 'thumbs_up'
	AND user_rate_ref != 'thumbs_down'

	RETURNING host_key;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at host queries 'getBookings'`, err));
};


const updateUserRating = (values, setting) => {

	const text = `
	UPDATE users
	SET ${setting} = ${setting} + 1
	WHERE public_key = $1;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at host queries 'getBookings'`, err));
};


module.exports = {
	updateHostRef,
	updateUserRef,
	updateUserRating,

};