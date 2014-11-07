var http = require('http'),
    url = require('url'),
    dict = require('./dict.js');

requestHandler = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      var data = JSON.parse(body);
      var contextWords = data.contextWords;
      var offset = data.offset;
      
      dict.getWord(contextWords, offset, function(wordJsonStr) {
        if (wordJsonStr)
          res.end(wordJsonStr);
        else
          res.end(JSON.stringify({'empty': true}));
      });
    });
  }
}

var server = http.createServer(requestHandler);
server.listen('8080', '127.0.0.1');
