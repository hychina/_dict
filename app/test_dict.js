var dict = require('./dict.js');
var contextWords = 'He had a dream about Claire. He dreamed that she was on a bus.'.split(' ');
dict.getWord(contextWords, 3, function (wordJsonStr) {
  console.log(JSON.stringify(JSON.parse(wordJsonStr), ' '));
});
