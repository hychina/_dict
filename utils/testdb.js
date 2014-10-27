var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , lineReader = require('line-reader'); 
  
var url = 'mongodb://localhost:27017/_dict';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log('connected to server ...');
  
  insertDocuments(db, function() {
    db.close();
  })
});

var insertDocuments = function (db, callback) {
  var collection = db.collection('sentences');
  
  lineReader.eachLine('../data/sentences.dmp', function(line, last) {
    var splits = line.split('|');
    
    if (n++ == 10) return false;
  });
  
  collection.insert({a:1}, function (err, result) {
    assert.equal(err, null);
    console.log('inserted into collection');
    callback(result);
  });
}

