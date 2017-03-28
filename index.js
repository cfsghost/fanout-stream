var Fanout = require('./lib/fanout');

module.exports = {
	createFanoutStream: function(streams, opts) {
		return new Fanout(streams, opts);
	}
};
