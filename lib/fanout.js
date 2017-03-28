var util = require('util');
var Duplex = require('stream').Duplex;
//var Queue = require('./queue');

var Fanout = module.exports = function(streams, options) {

	if (!(this instanceof Fanout))
		return new Fanout(options);

	this.buffer = [];
	this.streams = [];
	this.completed = 0;
	this.options = Object.assign({
		highWaterMark: 16,
		objectMode: false
	}, options || {});

	// Initializing streams
	streams.forEach(function(stream) {
		this.add(stream);
	}.bind(this));

	this.on('finish', function() {
		this.streams.forEach(function(stream) {
			stream.end();
		});
	}.bind(this));

	Duplex.call(this, {
		highWaterMark: this.options.highWaterMark,
		objectMode: this.options.objectMode
	});
};

util.inherits(Fanout, Duplex);

Fanout.prototype.add = function(stream) {

	stream.on('data', function(chunk) {

		if (this.isPaused()) {
			this.buffer.push(chunk);
		} else {
			this.push(chunk);
		}
	}.bind(this));

	stream.on('end', function() {

		this.completed++;
		if (this.completed >=  this.streams.length) {
			this.push(null);
		}
	}.bind(this));

	this.streams.push(stream);
};

Fanout.prototype._write = function(data, encoding, callback) {

	this.streams.forEach(function(stream) {
		stream.write(data);
	});

	callback();
};

Fanout.prototype._read = function(size) {

	for (var index = 0; index < size; index++) {
		var data = this.buffer.shift();
		if (data === undefined)
			break;

		if (!this.push(data))
			return;
	}
}
