# fanout-stream

It's a stream to fan out from source to streams and collect its output.

# Installation

Install module via NPM:
```shell
npm install fanout-stream
```

# Usage

```javascript
var fanout = require('fanout-stream');

// Create stream to fan out from source to two streams
var fanoutStream = fanout.createFanoutStream([
	outputStream1,
	outputStream2,
], { objectMode: true });
```

License
---
Licensed under the MIT License

Authors
---
Copyright(c) 2017 Fred Chien <<cfsghost@gmail.com>>
