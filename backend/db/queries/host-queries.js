const db = require('../../lib/db.js');

const getHost = () => {
	
	const text = `
	SELECT host, first_name, last_name, city, bio, image, day_rate, social_link, public_key
	FROM users
	WHERE host IS NOT FALSE;`;

	return db
		.query(text)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getHost'`, err));
};

const searchHost = (values) => {
console.log('vals', values)	
	const text = `
	SELECT host, first_name, last_name, city, bio, image, day_rate, social_link, public_key
	FROM users
	WHERE host IS NOT FALSE
	ORDER BY $1;`;

	return db
		.query(text, values)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at host queries 'getHost'`, err));
};


module.exports = {
	getHost,
	searchHost,

};
