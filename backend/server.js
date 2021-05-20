// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = 8080;
const ENV = process.env.NODE_ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.enable('trust proxy');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

//web sockets
const server = require('http').createServer(app);
const cors = require('cors');
app.use(cors());

const environment = 'http://localhost:3000'; // < -- frontend conn.
const io = require('socket.io')(server, {
	cors: {
		origin: environment,
		methods: ['GET', 'POST'],
	},
});

//create a socket.io connection
io.on('connection', (socket) => {
	const message = 'message';

	//listen for changes
	socket.on('input', (input) => {
		console.log('SOCKET:',input);
		socket.emit(message, input);
	});

	// disconnects socket with update message
	socket.on("disconnect", () => {
	io.emit(message, "A user has signed off the dashbaord");
	});
});


// PG database client/connection setup
const db = require('./lib/db.js');
db.connect();

//terminal in color
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/images', express.static('images')); 

app.use(
	cookieSession({
		name: 'session',
		keys: ['ses1', 'ses2', 'ses3'],
	})
);

// override for put, patch and delete methods
app.use(methodOverride('_method'));

// Separated Routes for each Resource
const usersRouter = require('./routes/api/users.js');
const hostsRouter = require('./routes/api/hosts.js');
const inboxRouter = require('./routes/api/inbox.js');
const bookingsRouter = require('./routes/api/bookings.js');
const chatRouter = require('./routes/api/chat.js');
const ipRouter = require('./routes/api/ip-address.js');
const stripeRouter = require('./routes/api/stripe.js');
const ratingRouter = require('./routes/api/rating.js');
const cronsRouter = require('./routes/api/crons.js');

// Mount all resource routes
app.use('/api/users', usersRouter);
app.use('/api/hosts', hostsRouter);
app.use('/api/inbox', inboxRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/ip-address', ipRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/rating', ratingRouter);
app.use('/api/crons', cronsRouter);

// Main routes
app.get('/', (req, res) => {
	res.send('Brave New World');
});


server.listen(PORT, () => {
	console.log(`Listening on PORT ${PORT}`);
});
