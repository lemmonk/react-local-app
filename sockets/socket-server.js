// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = 8080;
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

	//listen for changes
	socket.on('input', (input) => {
		console.log('SOCKET MSG:',input);
		io.emit(message, input);
	});

	// disconnects socket with update message
	io.on("disconnect", () => {
		console.log('socket disconnect')
	});
});


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
	res.send('socket host: '+environment);
});


server.listen(PORT, () => {
	console.log(`Listening on PORT ${PORT}`);
});
