var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

//Database configuration
//mongoose.connect('mongodb://localhost/mongoosescraper');
mongoose.connect('mongodb://gsgallant:mongoose1@ds015953.mlab.com:15953/mongoosescraper');
var db = mongoose.connection;

db.on('error', function (err) {
console.log('Mongoose Error: ', err);
});
db.once('open', function () {
console.log('Mongoose connection successful.');
});
var PORT = process.env.PORT || 8080; // Sets an initial port. We'll use this later in our listener
//Require Schemas
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Routes

//**** the '/' route was commented out because the index.html is in a static route
// seen above app.use(......'public')

// app.get('/', function(req, res) {
//   res.send(index.html);
// });

//scrape articles, place in MongoDB, and return them in doc for rendering in browser
app.get('/scrape', function(req, res){
    request('http://www.cnn.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    
	    	$('article h3').each(function(i, element) {
					var result = {};
					result.title = $(this).find('span').text();
					result.link = $(this).children('a').attr('href');
					//some CNN links already have http to an outside site otherwise they are cnn links.
					if(result.link.indexOf("http")<0){
						result.link='http://www.cnn.com'+result.link;
					}

					var entry = new Article (result);
					entry.save(function(err, doc) {
					  if (err) {
					    console.log(err);
					  } 
					})
	    })
		  
		  Article.find({}, function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.json(doc);
				}
			})
	})
});

//this gets the article and note and returns as a JSON to be used when
//displaying the text box for the note.  (headline goes above text box)
app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

//adds the note id to the article document as a reference back to the note
app.post('/savenote/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});

//delete the note from both collections (article and notes)
app.post('/deletenote/:id', function(req, res){
			Article.find({'_id': req.params.id}, 'note', function(err,doc){
			// .exec(function(err, doc){
				if (err){
					console.log(err);
				}
				//deletes the note from the Notes Collection
					Note.find({'_id' : doc[0].note}).remove().exec(function(err,doc){
						if (err){
							console.log(err);
						}

					});
				
			});
			//deletes the note reference in the article document
			Article.findOneAndUpdate({'_id': req.params.id}, {$unset : {'note':1}})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
});

//start express server
app.listen(PORT, function() {
    console.log("Server listening on PORT: " + PORT);
});
