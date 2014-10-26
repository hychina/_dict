var http = require('http'),
    url = require('url');

requestHandler = function (req, res) {
  var query = url.parse(req.url, true).query;
  console.log(query);
  res.setHeader('Content-Type', 'application/json');
  res.end(query);
}

var server = http.createServer(requestHandler);
server.listen('8080', '127.0.0.1');
