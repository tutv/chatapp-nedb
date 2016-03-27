var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Datastore = require('nedb')
	, db = new Datastore({filename: 'databases/chat.db', autoload: true});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//for (var i = 0; i < 1000000; i++) {
//	db.insert([
//		{
//			msg : Math.random().toString(36).substring(7),
//			type: 'message'
//		}
//	], function (err, newDocs) {
//		console.log(newDocs);
//		// Two documents were inserted in the database
//		// newDocs is an array with these documents, augmented with their _id
//	});
//}

app.get('/get', function (req, res) {
	db.find({}).sort({timestamp: 1}).limit(100).exec(function (err, docs) {
		res.json(docs);
	});
});

io.on('connection', function (socket) {
	console.log('a user connected');

	socket.on('chat_message', function (msg) {
		console.log('message: ' + msg);
		var d = new Date();

		db.insert([
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