const db = require('../../lib/db.js');

const getRatingCron = () => {
	
	const text = `
  SELECT * 
  FROM bookings
  WHERE stamp > NOW()
  AND status = 'Upcoming'`;

	return db
		.query(text)
		.then((res) => res.rows)
		.catch((err) => console.log(`Error at cron queries 'getCron'`, err));
};


const updateBookingStatus = values => {
	
	const text = `
		UPDATE bookings
		SET status = 'Complete'
		WHERE id = $1
		RETURNING *;`;
	


	return db
		.query(text, values)
		.then((res) => res.rows[0])
		.catch((err) => console.log(`Error at inbox queries 'getInbox'`, err));
};


module.exports = {
  getRatingCron,
  updateBookingStatus,

};