const db = require('../../lib/db.js');


const searchHost = (values) => {

	const text = `
	SELECT host, first_name, last_name, email, city, bio, image, day_rate, social_link, thumbs_up, thumbs_down, connect_id, customer_id, public_key
	FROM users
	WHERE host IS NOT FALSE
	AND connect_id IS NOT NULL`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getHost'`, err));
};

const searchHostByRating = (values) => {

	const text = `
	SELECT host, first_name, last_name, email, city, bio, image, day_rate, social_link, thumbs_up, thumbs_down, connect_id, customer_id, public_key
	FROM users
	WHERE host IS NOT FALSE
	AND connect_id IS NOT NULL
	AND thumbs_up > 0
	AND thumbs_down > 0
	AND thumbs_up + thumbs_down > 10
	ORDER BY thumbs_up / (thumbs_up + thumbs_down) * 100
	`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getHost'`, err));
};

const searchHostByPrice = (values) => {

	const text = `
	SELECT host, first_name, last_name, email, city, bio, image, day_rate, social_link, thumbs_up, thumbs_down, connect_id, customer_id, public_key
	FROM users
	WHERE host IS NOT FALSE
	AND connect_id IS NOT NULL
	ORDER BY day_rate;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getHost'`, err));
};


module.exports = {
	
	searchHost,
	searchHostByRating,
	searchHostByPrice,
};
