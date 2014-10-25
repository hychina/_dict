var http = require('http'),
    cheerio = require('cheerio');

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
  
  var word = [];
  
  $ = cheerio.load(str);
  collins = $('#en-collins');
  
  collins.find('.collins-item').each(function(i, elem) {
    var category = $(this).text();
    word.push({'category': category});
  });
  if (word.length == 0) {
    word.push({'category': 'default'});
  }
  
  collins.find('ul:not(ul ul)').each(function (i, elem) {
    word[i].items = [];
    // each item
    $(this).children('li:not(.collins-note)').each(function () {
      var examples = [];
      
      // examples
      $(this).find('ul li').each(function () {
        examples.push({
          'cn_definiton': $(this).children().eq(0).text(),
          'en_definiton': $(this).children().eq(1).text()
        });
      });
      
      // definition
      var def = $(this).find('h3').children();
      if (def.length > 0) {
        var definition = {};
        definition.def_id = parseInt(def.eq(0).text());
        definition.def_pos = def.eq(1).text();
        definition.def_cn = def.eq(2).text();
        definition.def_en = def.eq(3).text();
        
        word[i].items.push({
          'definiton': definition,
          'examples': examples
        });
      }

    });
  });
  console.log(JSON.stringify(word, null, " "));
}

var options = {
  host: 'dict.baidu.com',
  path: '/s?wd=bank',
  headers: {'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'}
}

callback = function (res) {
  var str = '';
  
  res.setEncoding('utf8');

  res.on('data', function(chunk) {
    str += chunk;
  });
  
  res.on('end', function() {
    parsehtml(str);
  });
}

var req = http.request(options, callback);
req.on('error', function (e) {
  console.log('error: ' + e.message);
});

req.end();
