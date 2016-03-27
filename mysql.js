var mysql = require('mysql');

// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
	, db = new Datastore({filename: 'databases/wp.db', autoload: true});
// You can issue commands right away


var connection = mysql.createConnection({
	host    : 'localhost',
	user    : 'root',
	password: '',
	database: 'wordpress'
});

connection.connect();

var d = new Date();
var start = d.getTime();
connection.query('SELECT * from wp_3_postmeta WHERE meta_id = 10', function (err, rows, fields) {
	if (!err) {
		console.log('The solution is: ', rows.length);
		var d_ = new Date();
		var end = d_.getTime();
		console.log('Start ' + start);
		console.log('End   ' + end);
		var sum = end - start;
		console.log(sum);
	}
	else {
		console.log('Error while performing Query.');
		console.log(err);
	}

});

//connection.query('SELECT * from wp_3_postmeta', function(err, rows, fields) {
//	if (!err) {
//		db.insert(rows, function (err, newDocs) {
//			console.log(newDocs);
//			// Two documents were inserted in the database
//			// newDocs is an array with these documents, augmented with their _id
//		});
//	}
//	else
//		console.log('Error while performing Query.');
//});

connection.end();