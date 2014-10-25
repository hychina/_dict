var http = require('http');

requestHandler = function (req, res) {
  body = 'hello, world.';
  res.setHeader('Content-Length', body.length);
  res.setHeader('Content-Type', 'application/json');
}

var server = http.createSerer(requestHandler);
server.listen();
