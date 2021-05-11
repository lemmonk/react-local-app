const db = require('../../lib/db.js');

const getInbox = values => {

	const text = `
	SELECT bookings.id, bookings.start_time, bookings.end_time, bookings.name as user_name, bookings.city as user_city, bookings.image as user_img, users.first_name as host_first_name, users.last_name as host_last_name, users.city as host_city, users.image as host_img, bookings.host_key, bookings.user_key
	FROM bookings
	JOIN users
	ON bookings.host_key = users.public_key
	WHERE bookings.user_key = $1
	AND bookings.color != 'black'
	AND bookings.stamp >= NOW()
  OR bookings.host_key = $1
	AND bookings.color != 'black'
	AND bookings.stamp >= NOW()
	ORDER BY bookings.stamp ASC;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at inbox queries 'getInbox'`, err));
};


const deleteInboxItem = values => {
	
	const text = `
	DELETE FROM bookings
	WHERE id = $1
	RETURNING *`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at inbox queries 'getInbox'`, err));
};


module.exports = {
	getInbox,
	deleteInboxItem,
};
