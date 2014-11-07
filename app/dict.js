var spider = require('./spider.js'),
    logger = require('./logger.js'),
    db = require('./db.js'),
    fs = require('fs'),
    java = require('java');

var dict = module.exports;

// load inflections mapping
var mapping = {};
var data = fs.readFileSync( '../data/inflections', 'utf8');
var infs = data.trim('\n').split('\n');
for (var i=0; i < infs.length; ++i) {
  var pair = infs[i].split(',');
  mapping[pair[0]] = pair[1];
}

java.classpath.push('../lib/stanford-postagger/stanford-postagger-3.5.0.jar');
java.classpath.push('.');
java.options.push('-Xmx256m');
var Tagger = java.import('Tagger');
var tagger = new Tagger();

var posMap = {
  'CC': ['CONJ-COORD', 'conj.'],
  'CD': ['NUM', 'num.'],
  'DT': ['DET', 'art.', 'det.'],
  'IN': ['PREP', 'CONJ-SUBORD', 'prep.', 'conj.'],
  'JJ': ['ORD', 'ADJ', 'ADJ-GRADED', 'adj.'],
  'JJR': ['ADJ', 'ADJ-GRADED', 'adj.'],
  'JJS': ['ADJ', 'ADJ-GRADED', 'adj.'],
  'MD': ['MODAL', 'aux.'],
    
  'NN': ['N-COUNT', 'N-VAR', 'N-UNCOUNT', 'N-SING', 'n.'],
  'NNS': ['N-COUNT', 'N-VAR', 'N-UNCOUNT', 'N-SING', 'n.'],
  'NNP': ['N-PROPER', 'n.'],
  'NNPS': ['N-PROPER', 'n.'],
    
  'PDT': ['PREDET'],
  'PRP': ['PRON-SING', 'PRON-PLURAL', 'PRON-REFL', 'PRON-REFL-EMPH', 'pron.'],
  'PRP$': ['DET_POSS', 'PRON-POSS', 'pron.'],
  'RB': ['ADV', 'ADV-GRADED', 'adv.'],
  'RBR': ['ADV', 'ADV-GRADED', 'adv.'],
  'RBS': ['ADV', 'ADV-GRADED', 'adv.'],
  'UH': ['EXCLAM', 'CONVENTION', 'int.'],
  'VB': ['VERB', 'V-RECIP', 'V-PASSIV', 'vt.', 'vi.', 'vt.& vi.'],
  'VBD': ['VERB', 'V-RECIP', 'V-PASSIV', 'vt.', 'vi.', 'vt.& vi.'],
  'VBG': ['VERB', 'V-RECIP', 'V-PASSIV', 'vt.', 'vi.', 'vt.& vi.'],
  'VBP': ['VERB', 'V-RECIP', 'V-PASSIV', 'vt.', 'vi.', 'vt.& vi.'],
  'VBZ': ['VERB', 'V-RECIP', 'V-PASSIV', 'vt.', 'vi.', 'vt.& vi.'],
};

function sortByTag(wordObj, tag) {
  var posTags = posMap[tag];
  if (!posTags) return;
  
  for (var i=0; i < wordObj.categories.length; ++i) {
    var cat = wordObj.categories[i];
    var index = 0;
    
    for (var j=0; j < cat.items.length; ++j) { 
      var def = cat.items[j].definition;
      if (def.def_pos) {
        var pos = def.def_pos;
        if (posTags.indexOf(pos) != -1) {
          if (j != index) {
            var temp = cat.items[j];
            cat.items[j] = cat.items[index];
            cat.items[index] = temp;
          }
          index++;
        }
      }
    }
  }
}

dict.getWord = function (contextWords, offset, callback) {
  var context = contextWords.join(' ');
  var tagged = tagger.tagStringSync(context);
  var taggedWords = tagged.split(' ');
  var wordAndTag = taggedWords[offset].split('_');
  var word = wordAndTag[0];
  var tag = wordAndTag[1];

  word = word.toLowerCase();
  var rootWord = mapping[word];
  if (rootWord) word = rootWord;
  
  console.log(taggedWords); 

  db.getWord(word, function (value) {
    if (!value)
      callback(null);
    else {
      var wordObj = JSON.parse(value);
      sortByTag(wordObj, tag);
      callback(JSON.stringify(wordObj));
    }
  });
}
