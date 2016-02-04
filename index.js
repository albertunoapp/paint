var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var constants = {
	numPixelsAcross: 64,
	numPixelsDown: 64
}

var canvas = [];

for (var x = 0; x < constants.numPixelsAcross; x++) {
	for (var y = 0; y < constants.numPixelsDown; y++) {
		canvas.push(0);
	}
}

io.on('connection', function(socket) {
	socket.emit('update', canvas);
	socket.on('clear', function() {
		var c = [];
		for (var x = 0; x < constants.numPixelsAcross; x++) {
			for (var y = 0; y < constants.numPixelsDown; y++) {
				c.push(0);
			}
		}
		canvas = c;
		io.emit('update', canvas);
	});
	socket.on('paint', function(json) {
		if (json && json.pixels) {
			for (var i = 0; i < json.pixels.length; i++) {
				var pixel = json.pixels[i];
				if (pixel && pixel.x >= 0 && pixel.y >= 0 && pixel.x < constants.numPixelsAcross && pixel.y < constants.numPixelsDown) {
					var index = (Math.floor(pixel.y) * constants.numPixelsAcross) + Math.floor(pixel.x);
					if (pixel.colour == 0) {
						canvas[index] = 0;
					} else if (pixel.colour == 1) {
						canvas[index] = 1;
					} else if (pixel.colour == 2) {
						canvas[index] = 2;
					} else if (pixel.colour == 3) {
						canvas[index] = 3;
					}
				}
			}
		}
		io.emit('update', canvas);
	});
});

// Host server on port 5000
http.listen(5000, function() {
	console.log('listening on *:5000');
});