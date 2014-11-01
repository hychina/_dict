var http = require('http'),
    cheerio = require('cheerio'),
    logger = require('./logger.js'),
    db = require('./db.js');

var spider = exports = module.exports;

parsehtml = function (str) {
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

  $ = cheerio.load(str);
  collins = $('#en-collins');
  
  // 所查单词不存在
  if (str.indexOf('词典中没有与您搜索的关键词匹配的内容') > -1 ||
      collins.length == 0) {
    logger.info(str);
    return null;
  }
  
  var word = {};
  word.categories = [];
  collins.find('.collins-item').each(function(i, elem) {
    var category = $(this).text();
    word.categories.push({'category': category});
  });
  if (word.categories.length == 0) {
    word.categories.push({'category': false});
  }
  
  collins.find('ul:not(ul ul)').each(function (i, elem) {
    word.categories[i].items = [];
    // each item
    $(this).children('li:not(.collins-note)').each(function () {
      
      // definition
      var def = $(this).find('h3').children();
      if (def.length > 0) {
        var definition = {};
        definition.def_id = parseInt(def.eq(0).text());
        definition.def_pos = def.eq(1).text();
        definition.def_cn = def.eq(2).text();
        definition.def_en = def.eq(3).text();
        
        // examples
        var examples = [];
        $(this).find('ul li').each(function () {
          examples.push({
            'example_en': $(this).children().eq(0).text(),
            'example_cn': $(this).children().eq(1).text()
          });
        });

        word.categories[i].items.push({
          'definition': definition,
          'examples': examples
        });
      }

    });
  });
  
  return word;
}

var options = {
  host: 'dict.baidu.com',
  path: '',
  headers: {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'}
}

responseHandler = function (res, wordStr, callback) {
  var str = '';
  
  res.setEncoding('utf8');

  res.on('data', function(chunk) {
    str += chunk;
  });
  
  res.on('end', function() {
    var wordJson = parsehtml(str);
    console.log('parsed html for ' + wordStr);
    if (!wordJson) 
      callback(null);
    else
      callback(wordJson);
  });
}

spider.fetchWord = function (wordStr, callback) {
  options.path = '/s?wd=' + wordStr;
  
  var req = http.request(options, function (res) {
    console.log('response got for: ' + wordStr);
    responseHandler(res, wordStr, callback);
  });
  
  req.on('socket', function (socket) {
    socket.setTimeout(20 * 1000);  
    socket.on('timeout', function() {
      req.abort();
      logger.error('timeout error: ' + wordStr);
      console.log('timeout error: ' + wordStr);
      callback(null);
    });
  });
  
  req.on('error', function (e) {
    logger.error('spider error: ' + e.message);
  });
  
  req.end();
  console.log('request sent for: ' + wordStr);
}

