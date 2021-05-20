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

				// for (const d of data) {

				// 	const filter = `${d.first_name} ${d.last_name} ${d.city}`;
				// 	const split= filter.split(' ');

				// 	if (filter.search(new RegExp(query, "i")) < 0) {

				// 		console.log('OUT', d.city);
				// 	} else {
				// 		console.log('INN', d.city);
				// 			results.push(d);
				// 	}

				// }

			
				const parse = query.replace(/[^\w\s]|_/g, "")
				.replace(/\s+/g, " ");
				const split= parse.split(' ');
		
				for (const d of data){

					const fn = d.first_name.replace(/[^\w\s]|_/g, "")
					.replace(/\s+/g, " ");

					const ln = d.last_name.replace(/[^\w\s]|_/g, "")
					.replace(/\s+/g, " ");

					const city = d.city.replace(/[^\w\s]|_/g, "")
					.replace(/\s+/g, " ");

					const terms = `${fn} ${ln} ${city}`;
					const filter = terms.split(' ');

					for(const s of split){

						if(filter.includes(s)){
							results.push(d);
							break;
						}
					}
					
					
				}





				return res.json(results)
			} else {
			
			const shuffledData = data.sort((a, b) => 0.5 - Math.random());
			return res.json(shuffledData)
			}

		})
		.catch((err) => console.log('Error at host SEARCH route "/"', err));
});

module.exports = router;
