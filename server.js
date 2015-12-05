var express = require('express');
var app = express();
var routes = require('./routes');
var http = require('http').Server(app);
// declare new instance of socket.io by passing the http server object
var io = require('socket.io')(http);

// set the "view" using ejs template engine
app.set('view engine', 'ejs');

// tell express to serve static files in public
app.use(express.static('public'));

// routes have been defined in the routes directory
app.get('/', routes.index);     // default directory
app.get('/game', routes.game);

var clients = [];

// tell express to serve up the "stuff" in the public directory
//app.use(express.static('public'));

io.on('connection', function (socket) {
  var clientCount = io.engine.clientsCount;
  console.log(socket.id + ' connected');
  console.log(clientCount + ' users connected');
  clients.push(socket);
  
  socket.on('disconnect', function () {
    clientCount = io.engine.clientsCount;
    console.log('user disconnected');
    console.log(clientCount + ' users connected');
    // http://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js
       var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
    
  });
  // server listening for user moves
  socket.on('piece move', function (data) {
    // send move to all connected clients
    io.emit('piece move', data);
  });
});

var port = 3000;
http.listen(port, function () {
  console.log('listening on: ' + port);
});

