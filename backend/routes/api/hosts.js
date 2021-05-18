const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');
const {
	getHost,
	searchHost,
} = require('../../db/queries/host-queries');

router.get('/', (req, res) => {

	getHost()
		.then((data) => res.json(data))
		.catch((err) => console.log('Error at hosts GET route "/"', err));
});

router.post('/', (req, res) => {

// var geo = geoip.lookup(req.ip);

	const query = req.body.query.search;
	let search = null;
	if (query.trim().length > 0) {
		search = query.split(' ');
	}

	let sortBy = req.body.query.sortBy === 'low' || 
	req.body.query.sortBy === 'high' 
  ? 'day_rate' : req.body.query.sortBy;

	const values = [sortBy];

	searchHost(values)
		.then((data) => {

		
			const results = [];
			if (search) {
				for (const d of data) {

					if (search.includes(d.city) || search.includes(d.first_name) || search.includes(d.last_name)) {

						results.push(d);
					}

				}

				return res.json(results)
			} else {
				return res.json(data)
			}

		})
		.catch((err) => console.log('Error at host SEARCH route "/"', err));
});

module.exports = router;
