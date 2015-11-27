var express = require('express');
var app = express();
var http = require('http').Server(app);

// declare new instance of socket.io by passing the http server object
var io = require('socket.io')(http);

// tell express to serve up the "stuff" in the public directory
app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

var port = 3000;

http.listen(port, function() {
    console.log('listening on: ' + port);
});

