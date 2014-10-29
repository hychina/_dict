var spider = require('../app/spider.js')
  , db = require('../app/db.js')
  , fs = require('fs');

var wordList = '../data/word_list';

var data = fs.readFileSync(wordList, 'utf8');
words = data.trim('\n').split('\n');

fetch = function(index) {
  word = words[index];
  console.log(word);
  spider.fetchWord(word, function (wordJson) { 
    if (wordJson)
      db.saveWord(word, JSON.stringify(wordJson));
  });
  setTimeout(function() { 
    fetch(index + 1);
  }, Math.random()*20000 + 1000);
}

fetch(0);
