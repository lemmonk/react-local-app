// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.NODE_ENV === 'production' ? 8080 : 8081;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.enable('trust proxy');
const morgan = require('morgan');
const methodOverride = require('method-override');

//web sockets io
const server = require('http').createServer(app);
const cors = require('cors');
app.use(cors());


//notifications
const webpush = require('web-push');
app.use(bodyParser.json());


let environment = process.env.HOST_URL; 
if (process.env.NODE_ENV === 'production'){
  environment = process.env.LIVE_URL
}

const io = require('socket.io')(server, {
	cors: {
		origin: environment,
		methods: ['GET', 'POST'],
	},
});

//create a socket.io connection
io.on('connection', (socket) => {
	const message = 'message';
	const push = 'push';

	//listen for changes
	socket.on('input', (input) => {
	
		io.emit(message, input);
		io.emit(push, input)
	});

	// disconnects socket with update message
	io.on("disconnect", () => {
		console.log('socket disconnect')
	});
});


//push notifications
const publicVapidKey = process.env.PUBLIC_VAPID;
const privateVapidKey = process.env.PRIVATE_VAPID;
const emailVapid = process.env.EMAIL_VAPID;

webpush.setVapidDetails(emailVapid, publicVapidKey, privateVapidKey);

app.post('/subscribe', async (req, res) => {

const input = req.body.input;
const subscription = input.subscription;
const name = input.fullName;

	res.status(201).json();

	const payload = name;
	await webpush.sendNotification(subscription, payload);

})



//terminal in color
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/images', express.static('images')); 


// override for put, patch and delete methods
app.use(methodOverride('_method'));


// Main routes
app.get('/', (req, res) => {
	res.send('xyz');
});


server.listen(PORT, () => {
	console.log(`Listening on PORT ${PORT}`);
});
