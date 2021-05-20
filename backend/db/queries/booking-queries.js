const db = require('../../lib/db.js');

const getBookings = values => {
	
	const text = `
	SELECT id, host_key, user_key, title, color, start_time, end_time 
	FROM bookings
	WHERE host_key = $1
	AND status != 'Cancelled'
	AND stamp >= NOW()
	OR user_key = $1
	AND status != 'Cancelled'
	AND stamp >= NOW()
	;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getBookings'`, err));
};

const createBooking = values => {
	console.log('vals', values)
	const text = `
	INSERT INTO bookings
	(host_key, host_name, host_email, host_city, user_key, user_name, user_email, user_city, status, price, title, color, start_time, end_time, host_rate_ref, user_rate_ref, stamp) 
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
	RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at booking queries 'createBookings'`, err));
};

const blockBooking = values => {
	
	const text = `
	INSERT INTO bookings
	(host_key, user_key, status, title, color, start_time, end_time, stamp) 
	VALUES($1, $2, $3, $4, $5, $6, $7, $8)
	RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at booking queries 'createBookings'`, err));
};


const fetchBooking = values => {
	
	const text = `
	SELECT bookings.id, first_name, last_name, city, phone, image, status, public_key, start_time, end_time
	FROM bookings
	JOIN users
	ON users.public_key = bookings.user_key
	WHERE bookings.id = $1;`;

	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at booking queries 'fetchBookings'`, err));
};

const deleteBooking = values => {
	
	const text = `
	DELETE FROM bookings
	WHERE id = $1
	RETURNING *;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at booking queries 'createBookings'`, err));
};




module.exports = {
	getBookings,
	createBooking,
	blockBooking,
	fetchBooking,
	deleteBooking,
};
