'use strict';

const AssetRevving = require('asset-revving');
const gutil = require('gulp-util');
const path = require('path');
const through = require('through2');

module.exports = opts => {
	return through.obj( function (file, enc, callback) {
		if (file.isNull()) {
			callback(new gutil.PluginError('gulp-asset-revving', 'No file provided'));
			return;
		}

		if (file.isStream()) {
			callback(new gutil.PluginError('gulp-asset-revving', 'Streaming not supported'));
			return;
		}

		let stream = this;

		(new AssetRevving( opts ).revving( file.path, file.contents ).then( product => {

			// let's get the product into a file and into our stream
			let newFile = new gutil.File({
				base: file.base,
				path: path.join(product.folder, opts.mode + '.html'),
				contents: new Buffer(product.contents)
			});

			stream.push(newFile);

			callback(null, file);
		}));
	});
};