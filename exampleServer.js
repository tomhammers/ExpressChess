var express = require('express');
var http = require('http');
// build the app
var app = express();


//middleware
app.all("*", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  next();
});

app.get("/", function(request, response) {
  response.end("Welcome to the homepage!");
});

app.get("/about", function(request, response) {
  response.end("Welcome to the about page!");
});

app.get("*", function(request, response) {
  response.end("404!");
});
// app.get('/', function(req, res){
//   res.send('<b>Hello</b> World');
//   console.log("Hello");
// });

// start everything up
http.createServer(app).listen(1337);
// shorthand for above
//app.listen(3000);


