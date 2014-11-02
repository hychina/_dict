function queryWord(word) {
  $.ajax({
    url: '/demo/dict/q',
    data: {
      'wd': word
    },
    type: 'GET',
    dataType: 'json',
    success: function (json) {
      if (json.empty) {
        alert('null');
        return;
      }
      var template = $('#collinsTp').html();
      var html = Mustache.to_html(template, json);
      $('.collins').html(html);
      
      $('.context').css('float', 'left');
      $('.collins').css({'margin-left': '420px', 'display': 'block'});
    },
    error: function( xhr, status, errorThrown ) {
      alert( 'Sorry, there was a problem!' );
      console.log( 'Error: ' + errorThrown );
      console.log( 'Status: ' + status );
      console.dir( xhr );
    }
  });
}

function Context() {
}

Context.prototype = {
  transformDisplay: function (contextWords) {
    contextWords = contextWords.match(/\w+/g);
    var dispayDiv = $('div.context_display');
    for (var i = 0, len = contextWords.length; i < len; i++) {
      dispayDiv.append('<span class="clickable-word">' + contextWords[i] + '</span>');
    }
    
    var lastClickedSpan = null;
    
    $('span.clickable-word').mouseover(function () {
      $(this).css('background-color', '#888');
    })
    .mouseout(function () {
      $(this).css('background-color', '#60b044');
    })
    .click(function () { 
      if (lastClickedSpan === this) 
        return false;
        
      queryWord($(this).text());
      
      if (lastClickedSpan) {
        $(lastClickedSpan).css('background-color', '#60b044');
        $(lastClickedSpan).mouseout(function () {
          $(this).css('background-color', '#60b044');
        });
      }
      lastClickedSpan = this;
      $(this).off('mouseout');
    });
  }
}

var context = new Context();

/* envent handlers */

$('#context_field').focus(function () {
  $('.center').addClass('focused');
});

$('#context_field').blur(function () {
  $('.center').removeClass('focused');
});

$('p.hint').click(function () {
  $('#context_field').focus();
});

function toggleConfirmButton() {
  if ($(this).val() != '') {
    $('button.confirm').prop('disabled', false).removeClass('disabled');
  } else {
    $('button.confirm').prop('disabled', true).addClass('disabled');
  }
}

$('#context_field').keyup(toggleConfirmButton);

$('button.confirm').prop('disabled', true);

// transform context string into clickable objects
$('button.confirm').click(function () {
  $('button.cancel').css('display', 'block');
  $(this).hide();
  $('div.context_display').show();
  $('#context_field').hide();
  $('p.hint').text('请选择要查询的单词');
  context.transformDisplay($('#context_field').val());
});

$('button.cancel').click(function () {
  $('button.confirm').css('display', 'block');
  $(this).hide();
  $('#context_field').show();
  $('div.context_display').hide();
  $('div.context_display').empty(); // 清空动态添加的span
  $('p.hint').text('请输入单词所在的上下文');
  
  $('.context').removeAttr('style');
  $('.collins').removeAttr('style');
  $('.collins').empty();
});

