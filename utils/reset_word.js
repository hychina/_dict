var spider = require('../app/spider.js'),
    db = require('../app/db.js');

var wordStr = process.argv[2];
if (!wordStr) return;

spider.fetchWord(wordStr, function (wordJson) {
  if (!wordJson)
    console.log('fetching failed');
  else {
    var wordJsonStr = JSON.stringify(wordJson);
    db.saveWord(wordStr, wordJsonStr);
  }
});
