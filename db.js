// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
	, db = new Datastore({filename: 'databases/wp.db', autoload: true});
// You can issue commands right away

var d = new Date();
var start = d.getTime();

//db.insert([
//	{
//		name   : "Tu",
//		user_id: 1
//	}
//], function (err, newDocs) {
//	console.log(newDocs);
//	// Two documents were inserted in the database
//	// newDocs is an array with these documents, augmented with their _id
//});

// Finding all planets in the solar system
//db.find({user_id: 1, msg: "Hello world"}, function (err, docs) {
//	console.log(docs);
//});


db.find({_id: "01RMtkBddDqCBrJH"}, function (err, docs) {
	var d_ = new Date();
	var end = d_.getTime();
	console.log('Start ' + start);
	console.log('End   ' + end);
	var sum = end- start;
	console.log(sum);
	console.log(docs);
});