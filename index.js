var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('md5');
var session = require('express-session');
var mustacheExpress = require('mustache-express');

/**
 * Static file
 */
app.use(express.static(__dirname + '/public'));

/**
 * Set engine template
 */
app.set('view engine', 'jade');

app.set('views', __dirname + '/views');

/**
 * Databases
 */
var Datastore = require('nedb'),
	messages_db = new Datastore({filename: 'databases/messages.db', autoload: true}),
	users_db = new Datastore({filename: 'databases/users.db', autoload: true}),
	rooms_db = new Datastore({filename: 'databases/rooms.db', autoload: true});

/**
 * Index
 */
messages_db.ensureIndex({fieldName: 'room_id'}, function (err) {
	console.log('Error Indexing: ');
	console.log(err);
});

/**
 * Index
 */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/room/:id', function (req, res) {
	res.render('room', {title: 'Hey', message: 'Hello there!'});
});

app.get('/room', function (req, res) {
	res.render('rooms', {title: 'Rooms'});
});

/**
 * API GET Message
 */
app.get('/get', function (req, res) {
	messages_db.find({}).sort({timestamp: 1}).limit(100).exec(function (err, docs) {
		res.json(docs);
	});
});

/**
 * Seeder
 */
app.get('/seed', function (req, res) {
	res.send('Hello!');
});

/**
 * Socket
 */
io.on('connection', function (socket) {
	console.log('A user connected');

	socket.on('chat_message', function (msg) {
		console.log('message: ' + msg);
		var d = new Date();

		messages_db.insert([
			{
				msg      : msg,
				type     : 'message',
				timestamp: d.getTime()
			}
		], function (err, newDocs) {
			console.log(newDocs);
		});

		io.emit('chat_message', msg);
	});

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});

http.listen(3000, function () {
	console.log('listening on *:80');
});