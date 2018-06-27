var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
// declare new instance of socket.io by passing the http server object
var io = require('socket.io')(http);

var Moniker = require('moniker'); // generates nicknames
var names = Moniker.generator([Moniker.adjective]);
var clients = [];
var rooms = [];

var player1 = undefined;
var player2 = undefined;

var roomID = '';
var URL = '';
var chessURL = ''; // url that player 1 will need to send to player 2
var clientsInRoom = 0; // how many clients in a room?

// generates a string of characters for the new game room
function generateChessRoomID(length) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var room = '';
  for (var i = 0; i < length; i++) {
    // will admit to google for this part!
    room += chars.charAt(Math.floor(Math.random() * 62));
  }
  return room;
}

// set the "view" using ejs template engine
app.set('view engine', 'ejs');
// tell express to serve static files in public
app.use(express.static('public'));

app.get('/', function(req, res) {
  // generate roomID on this route
  roomID = generateChessRoomID(6);
  chessURL = req.protocol + '://' + req.get('host') + req.path + roomID;

  res.render('default', {
    title: 'ExpressChess',
  });
});

// this route only allows a regex containing 6 alphanumeric chars
app.get('/:room([A-Za-z0-9]{6})', function(req, res) {
  chessURL = req.protocol + '://' + req.get('host') + req.path;
  chessURL += req.url;
  URL = req.protocol + '://' + req.get('host');
  console.log(URL);
  // get roomID from URL on this route
  roomID = req.params.room;
  res.render('default', {
    title: 'ExpressChess',
  });
});

io.on('connection', function(socket) {
  var clientCount = io.engine.clientsCount;
  socket.nickname = names.choose(); // moniker randomly chooses a nickname

  // roomID already generated
  //room does not exist, create it and set game up as player 1
  if (rooms.indexOf(roomID) === -1) {
    rooms.push(roomID);
    console.log('added room ' + roomID + ' to the array');
    socket.join(roomID);
    // now send player 1 game info
    socket.emit('new game', {
      room: roomID,
      shareURL: chessURL,
      player: 1,
      nickname: socket.nickname,
      colour: 'white',
      url: URL,
    });
    // else room already exists, we will assume player 2, slight possibility of someone unintended entering the game?
  } else {
    socket.join(roomID);
    // if number of clients equals 2 exactly
    if (Object.keys(socket.adapter.rooms[roomID]).length === 2) {
      console.log(
        Object.keys(socket.adapter.rooms[roomID]).length +
          ' users in room ' +
          roomID,
      );
      socket.emit('new game', {
        room: roomID,
        shareURL: chessURL,
        player: 2,
        nickname: socket.nickname,
        colour: 'black',
        url: URL,
      });
      socket.broadcast.to(roomID).emit('black connected', {
        nickname: socket.nickname,
      });
    }
    // if a third client connects to the same game we need to deal with it
    if (Object.keys(socket.adapter.rooms[roomID]).length > 2) {
      socket.leave(roomID);
      //
      socket.emit('game full', { url: URL });
    }
  } // else

  socket.on('piece move', function(data) {
    // send move to users in room
    // client sends roomID
    socket.broadcast.to(data.room).emit('piece move', data);
  });

  // black sends white their nickname
  socket.on('white nickname', function(data) {
    socket.broadcast.to(data.room).emit('white nickname', data);
  });

  console.log(socket.id + ' ' + socket.nickname + ' connected');
  console.log(clientCount + ' users connected');
  clients.push(socket);

  // only sends to winner
  socket.on('checkmate', function(data) {
    socket.broadcast.to(data.room).emit('checkmate', { url: URL });
  });

  socket.on('disconnect', function() {
    clientCount = io.engine.clientsCount;
    console.log('user disconnected');
    console.log(clientCount + ' users connected');
    // http://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js
    var index = clients.indexOf(socket);
    console.log(index);
    if (index != -1) {
      clients.splice(index, 1);
      console.info('Client gone (id= ' + socket.id + ')');
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, function() {
  console.log('listening on: ' + PORT);
});
