const db = require('../../lib/db.js');

const getInbox = values => {

	const text = `
	SELECT bookings.id, bookings.start_time, bookings.end_time,
	bookings.host_key, bookings.host_name, bookings.host_email, bookings.host_city, bookings.host_image, bookings.user_key, bookings.user_name, bookings.user_email, bookings.user_image, bookings.status
	FROM bookings
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
	deleteInboxItem,
};
