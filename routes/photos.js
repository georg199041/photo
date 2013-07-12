var Photo = require('../models/Photo'); 
var path = require('path');
var fs = require('fs');
var fsExtra = require ('fs.extra');
var util = require('util');
var join = path.join;

exports.list = function(req, res, next){
	Photo.find({}, function(err, photos){ 
		if (err) return next(err);
		res.render('photos', {
			title: 'Photos',
			photos: photos
		});
	});
};

exports.form = function(req, res){
	res.render('photos/upload', {
		title: 'Photo upload'
	});
};

exports.submit = function (dir) {
	return function(req, res, next){ 
		var img = req.files.photo.image;
		var name = req.body.photo.name || img.name; 
		var path = join(dir, img.name);

		fsExtra.move (img.path, path, function (err) {
	    	Photo.create({
				name: name,
				path: img.name
			}, function (err) {
				if (err) return next(err); 
				res.redirect('/'); 
			});
		});

		img.path.pipe(path);
		img.path.on('end',function() {
		    fs.unlinkSync(img.path);
		    if (err) return next(err); 
		
		});
	};
};

exports.download = function(dir){ 
	return function(req, res, next){ 
		var id = req.params.id;
		Photo.findById(id, function(err, photo){ 
			if (err) return next(err);
			var path = join(dir, photo.path); 
			res.download(path, photo.name+'.jpeg');
		});
	};
};