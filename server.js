var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('<b>Hello</b> World');
});
app.listen(3000);


