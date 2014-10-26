var redis = require('redis'),
    logger = require('./logger.js');

var client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
  logger.error(err);
});

var db = exports = module.exports;

db.getWord = function (word) {
  client.get(word, function (err, value) {
    if (err) throw err;
    return value;
  });
}

db.saveWord = function (wordStr, wordObj) {
  client.set(wordStr, wordObj);
}
