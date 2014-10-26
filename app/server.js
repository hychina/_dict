var http = require('http'),
    url = require('url'),
    spider = require('./spider.js'),
    logger = require('./logger.js');

requestHandler = function (req, res) {
  var query = url.parse(req.url, true).query;
  var wordStr = query.wd;
  
  /* TODO: 如果wd为空，跳转到/demo/dict */
  
  spider.fetchWord(wordStr, function(wordJson) {
    res.setHeader('Content-Type', 'application/json');
    if (wordJson)
      res.end(JSON.stringify(wordJson));
    else
      res.end(null);
  });
}

var server = http.createServer(requestHandler);
server.listen('8080', '127.0.0.1');
