var redis = require('redis'),
    logger = require('./logger.js'),
    spider = require('./spider.js');

var client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
  logger.error(err);
});

var db = exports = module.exports;

db.getWord = function (word, callback) {
  client.get(word, function (err, value) {
    if (err) throw err;
    if (!value) //spider
      spider.fetchWord(word, function (wordJson) {
        if (!wordJson)
          callback(null);
        else {
          var wordJsonStr = JSON.stringify(wordJson);
          callback(wordJsonStr);
          db.saveWord(word, wordJsonStr);
        }
      });
    else 
      callback(value);
  });
}

db.saveWord = function (wordStr, wordJson) {
  client.set(wordStr, wordJson);
}
