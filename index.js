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

app.get('/add', function (req, res) {
	var d = new Date();
	rooms_db.insert([
		{
			name      : 'Room 1',
			members   : [],
			created_at: d.getTime(),
			updated_at: d.getTime()
		}
	], function (err, newDocs) {
		console.log(newDocs);
	});
});

app.get('/addUser', function (req, res) {
	var d = new Date();
	users_db.insert([
		{
			name      : 'Tú Trần 2',
			email     : 'tutv@gmail.com',
			pass      : md5('123456'),
			created_at: d.getTime(),
			updated_at: d.getTime()
		}
	], function (err, newDocs) {
		console.log(newDocs);
	});
});

/**
 * Index
 */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/room/:id', function (req, res) {
	var id = req.params.id;
	rooms_db.find({_id: id}, function (err, docs) {
		if (err) {
			res.status(404).send('Sorry, we cannot find that!');
		} else {
			if (docs.length == 0) {
				res.status(404).render('404');
			} else {
				var room = docs[0];
				var memberIDs = room.members;
				var memberID_end = memberIDs[memberIDs.length - 1];
				var memberObjects = [];
				for (var i = 0; i < memberIDs.length; i++) {
					var user_id = memberIDs[i];
					users_db.find({_id: user_id}, function (err, docs) {
						var user = docs[0];
						memberObjects.push(user);

						if (memberID_end == user._id) {
							render_room(res, room, memberObjects);
						}
					});
				}
			}
		}
	});
});

function render_room(res, room, memberObjects) {
	res.render('room', {room: room, members: memberObjects});
}

app.get('/room', function (req, res) {
	rooms_db.find({}, function (err, docs) {
		if (err) {
			res.status(404).send('Sorry, we cannot find that!');
		} else {
			res.render('rooms', {rooms: docs});
		}
	});

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