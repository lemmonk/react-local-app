const db = require('../../lib/db.js');

const getInbox = values => {

	const text = `
	SELECT id, start_time, end_time,
	host_key, host_name, host_email, host_city, user_key, user_name, user_email, status
	FROM bookings
	WHERE user_key = $1
	AND color != 'black'
  OR host_key = $1
	AND color != 'black'
	ORDER BY stamp ASC
	;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at inbox queries 'getInbox'`, err));
};


const fetchInfo = values => {
	console.log(values);
	const text = `
		SELECT first_name, last_name, email, city, bio, image, day_rate, social_link, thumbs_up, thumbs_down, connect_id, customer_id, public_key
		FROM users
		WHERE public_key = $1`;
	
	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at inbox queries 'getInbox'`, err));
};


const deleteInboxItem = values => {
	
	const text = `
		UPDATE bookings
		SET status = 'Cancelled'
		WHERE id = $1
		RETURNING *;`;
	


	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at inbox queries 'getInbox'`, err));
};


module.exports = {
	getInbox,
	fetchInfo,
	deleteInboxItem,
};
