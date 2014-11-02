var http = require('http'),
    cheerio = require('cheerio'),
    logger = require('./logger.js'),
    db = require('./db.js'),
    request = require('request');

var spider = exports = module.exports;

parsehtml = function (str) {
  $ = cheerio.load(str);
  
  /*
   * <div id="en-simple-means">
   *   <div>
   *     <p>
   *       <strong>
   *       <span>
  */
  var simple = $('#en-simple-means');

  /*
   * <div id="en-collins">
   *   <p class="collins-item"> // category
   *   <ul> // items
   *     <li>
   *       <h3> // definition
   *       <ul> // examples
   *         <li>
   *           <p> // english
   *           <p> // chinese
  */
  var collins = $('#en-collins');
  
  // 所查单词不存在
  if (str.indexOf('词典中没有与您搜索的关键词匹配的内容') > -1 ||
      (collins.length === 0 && simple.length === 0)) {
    logger.info(str);
    return null;
  }
  
  var word = {};
  word.categories = [];
  
  // collins不存在
  if (collins.length === 0) {
    word.categories.push({'category': false});
    word.categories[0].items = [];
    simple.find('div p').each(function(i, elem) {
      var def = $(this).children();
      var definition = {};
      definition.def_id = i + 1;
      definition.def_pos = def.eq(0).text();
      definition.def_cn = def.eq(1).text();
      definition.def_en = '';
      
      word.categories[0].items.push({
        'definition': definition,
        'examples': false
      });
    });
    return word;
  }
  
  collins.find('.collins-item').each(function(i, elem) {
    var category = $(this).text();
    word.categories.push({'category': category});
  });
  
  if (word.categories.length === 0) {
    word.categories.push({'category': false});
  }
  
  collins.find('ul:not(ul ul)').each(function (i, elem) {
    word.categories[i].items = [];
    
    $(this).find('h3:not(li.collins-note h3)').each( function() {
      var definition = {};
      // definition
      var def = $(this).children();
      if (def.length > 0) {
        definition.def_id = parseInt(def.eq(0).text());
        definition.def_pos = def.eq(1).text();
        definition.def_cn = def.eq(2).text();
        definition.def_en = def.eq(3).text();
      }
      word.categories[i].items.push({
        'definition': definition
      });
    });

    // examples
    $(this).find('ul:not(li.collins-note ul)').each(function (j) {
      var examples = [];
      $(this).find('li').each(function () {
        examples.push({
          'example_en': $(this).children().eq(0).text(),
          'example_cn': $(this).children().eq(1).text()
        });
      });
      word.categories[i].items[j].examples = examples;
    });

  });
  
  return word;
};

spider.fetchWord = function (wordStr, callback) {
  var options = {
    url: 'http://dict.baidu.com/s?wd=' + wordStr,
    method: 'GET',
    timeout: 20000,
    headers: {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'}
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var wordJson = parsehtml(body);
      console.log('parsed html for ' + wordStr);
      if (!wordJson) 
        callback(null);
      else
        callback(wordJson);
    } else {
      if (error) {
        var msg = wordStr + ' : spider error : ' + error;
        logger.error(msg);
        console.log(msg);
      }
      callback(null);
    }
  });
  
  console.log('request sent for: ' + wordStr);
};

