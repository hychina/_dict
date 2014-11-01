var spider = require('../app/spider.js')
  , db = require('../app/db.js')
  , fs = require('fs');

var wordList = '../data/word_list';

var data = fs.readFileSync(wordList, 'utf8');
words = data.trim('\n').split('\n');
  
fetch = function(index) {
  if (index >= words.length) return;
  word = words[index];
  
  db.getWord(word, function (value) {
    if (!value) {
      console.log('fetching ' + word + ' ...');
      spider.fetchWord(word, function (wordJson) { 
        if (wordJson) {
          db.saveWord(word, JSON.stringify(wordJson));
          setTimeout(function() { fetch(index + 1); }, Math.random()*20000 + 1000);
        } else {
          console.log('not fetched: ' + word);
          setTimeout(function() { fetch(index + 1); }, Math.random()*1000 + 1000);
        }
      });
    } else {
      console.log('already in the database: ' + word);
      fetch(index + 1);
    }
  });
}

fetch(0);
