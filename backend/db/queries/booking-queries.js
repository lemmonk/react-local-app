const db = require('../../lib/db.js');

const getBookings = values => {
	
	const text = `
	SELECT id, host_key, user_key, title, color, start_time, end_time 
	FROM bookings
	WHERE host_key = $1
	AND stamp >= NOW()
	OR user_key = $1
	AND stamp >= NOW()
	;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getBookings'`, err));
};

const createBooking = values => {
	
	const text = `
	INSERT INTO bookings
	(host_key, user_key, name, city, image, title, color, start_time, end_time, stamp) 
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at booking queries 'createBookings'`, err));
};

const fetchBooking = values => {
	
	const text = `
	SELECT bookings.id, first_name, last_name, city, phone, image, public_key, start_time, end_time
	FROM bookings
	JOIN users
	ON users.public_key = bookings.user_key
	WHERE bookings.id = $1`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at booking queries 'fetchBookings'`, err));
};

const deleteBooking = values => {
	
	const text = `
	DELETE FROM bookings
	WHERE id = $1
	RETURNING *`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at booking queries 'createBookings'`, err));
};


module.exports = {
	getBookings,
	createBooking,
	fetchBooking,
	deleteBooking,
};
