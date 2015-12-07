var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
// declare new instance of socket.io by passing the http server object
var io = require('socket.io')(http);

var uuid = require('node-uuid');  // generate url
var Moniker = require('moniker'); // generates nicknames
var names = Moniker.generator([Moniker.adjective]);
var clients = [];
var player1 = undefined;
var player2 = undefined;
var rooms = [];
var roomID = "";
var chessURL = ""; // url that player 1 will need to send to player 2

// generates a string of characters for the new game room
function generateChessRoom(length) {
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var room = '';
		for (var i = 0; i < length; i++) {
    room += chars.charAt(Math.floor(Math.random() * 62));
		}
		return room;
};
  
// set the "view" using ejs template engine
app.set('view engine', 'ejs');
// tell express to serve static files in public
app.use(express.static('public'));

app.get('/', function (req, res) {
  chessURL = req.protocol + '://' + req.get('host') + req.path;
  res.render('default', {
    title: 'ExpressChess'
  });
});

// user can access any url ending with 6 chars, however to play with friend it has to be right combo
app.get('/:room([A-Za-z0-9]{6})', function (req, res) {
  chessURL += req.url;
  res.render('default', {
    title: 'ExpressChess'
  });
});

io.on('connection', function (socket) {
  var clientCount = io.engine.clientsCount;
  socket.nickname = names.choose(); // moniker randomly chooses
  
  if (clientCount === 1) { // start a new game!
    roomID = generateChessRoom(6);
    chessURL += roomID // I hope this will be a scoket room, accessed via url
    socket.emit('new game', {
      room: roomID,
      shareURL: chessURL,
      player: 1,
      nickname: socket.nickname,
      colour: "white"
    });
  }

  if (clientCount === 2) {
    socket.emit('new game', {
      room: roomID,
      shareURL: chessURL,
      player: 2,
      nickname: socket.nickname,
      colour: "black"
    });
  }
  
  if (clientCount > 2) {
    // spectate - worry about it later!
    socket.emit('new game', {
      room: roomID,
      shareURL: chessURL,
      player: 2,
      nickname: socket.nickname,
      colour: "black"
    });
  }
  
  // players who use same link should connect to a specific room
  socket.on('join room', function(data) {
    socket.join(data.room);
  });
  
  //nicknames.push(socket.nickname);
  console.log(socket.id + " " + socket.nickname + ' connected');
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
    //socket.broadcast.emit('piece move', data);
    socket.broadcast.to(roomID).emit('piece move', data);
  });
});

var port = 3000;
http.listen(port, function () {
  console.log('listening on: ' + port);
  //console.log(Moniker.choose());
  console.log(names.choose());
});

