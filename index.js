'use strict';

const AssetRevving = require('@pentia/asset-revving');
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

		const assetRevving = new AssetRevving(opts);

		let stream = this;

		let product = assetRevving.revving( file.path, file.contents, '---' );

		let newFile = new gutil.File({
			base: file.base,
			path: path.join(file.base, path.basename(file.path, path.extname(file.path)) + '.html'),
			contents: new Buffer(product.contents)
		});

		stream.push(newFile);

		callback(null, file);
	});
};