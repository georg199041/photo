
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , photos = require('./routes/photos')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
	// all environments
	app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('photos', __dirname + '/public/photos');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', photos.list);
app.get('/upload', photos.form);
app.post('/upload', photos.submit(app.get('photos')));
app.get('/photo/:id/download', photos.download(app.get('photos')));
//app.get('/', routes.index);
app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
