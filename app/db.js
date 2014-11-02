var redis = require('redis')
  , logger = require('./logger.js');

var client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
  logger.error(err);
});

var db = exports = module.exports;

db.getWord = function (word, callback) {
  client.get(word, function (err, value) {
    if (err) throw err;
    callback(value);
  });
}

db.saveWord = function (wordStr, wordJsonStr) {
  client.set(wordStr, wordJsonStr);
  console.log('saved in databse: ' + wordStr);
}

db.getAllKeys = function () {
  client.keys('*', function (err, keys, callback) { 
    if (err) throw err; 
    callback(keys);
  });
}
