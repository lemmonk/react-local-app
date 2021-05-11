const express = require('express');
const router = express.Router();
const ip = require('ip');
const geoip = require('geoip-lite');


router.get('/', (req, res) => {

const ENV = process.env.NODE_ENV || 'development';
const geo = ENV === 'production' ? 
geoip.lookup(ip.address()) : geoip.lookup('66.183.29.157');

res.json(geo);
});



module.exports = router;
