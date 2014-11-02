var http = require('http'),
    url = require('url'),
    spider = require('./spider.js'),
    logger = require('./logger.js'),
    db = require('./db.js'),
    fs = require('fs');

// load inflections mapping
var mapping = {};
var data = fs.readFileSync( '../data/inflections', 'utf8');
var infs = data.trim('\n').split('\n');
for (var i=0; i < infs.length; ++i) {
  var pair = infs[i].split(',');
  mapping[pair[0]] = pair[1];
}

requestHandler = function (req, res) {
  var query = url.parse(req.url, true).query;
  var wordStr = query.wd.toLowerCase();
  
  /* TODO: 如果wd为空，跳转到/demo/dict */
  
  res.setHeader('Content-Type', 'application/json');
  
  var rootWord = mapping[wordStr];
  if (rootWord) wordStr = rootWord;
  db.getWord(wordStr, function(wordJsonStr) {
    if (wordJsonStr)
      res.end(wordJsonStr);
    else
      res.end(JSON.stringify({'empty': true}));
      // spider.fetchWord(wordStr, function (wordJson) {
      //   if (!wordJson)
      //     res.end(null);
      //   else {
      //     var wordJsonStr = JSON.stringify(wordJson);
      //     db.saveWord(wordStr, wordJsonStr);
      //     res.end(wordJsonStr);
      //   }
      // });
  });
}

var server = http.createServer(requestHandler);
server.listen('8080', '127.0.0.1');
