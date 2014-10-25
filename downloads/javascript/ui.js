function Context(contextWords) {
  this.contextWords = contextWords.trim().split(/\s+/);
}

Context.prototype = {
  transformDisplay: function () {
    var dispayDiv = $("div.context_display");
    for (var i = 0, len = this.contextWords.length; i < len; i++) {
      dispayDiv.append("<span>" + this.contextWords[i] + "</span>");
    }
    $("span").mouseover(function () {
      $(this).css("background-color", "#60b044");
    });
    $("span").mouseout(function () {
      $(this).css("background-color", "#e0eaf1");
    });
  }
}

/* envent handlers */

$('#context_field').focus(function () {
  $(".center").addClass("focused");
});

$('#context_field').blur(function () {
  $(".center").removeClass("focused");
});

$("p.hint").click(function () {
  $("#context_field").focus();
});

function toggleConfirmButton() {
  if ($(this).val() != "") {
    $("button.confirm").prop("disabled", false).removeClass("disabled");
  } else {
    $("button.confirm").prop("disabled", true).addClass("disabled");
  }
}

$("#context_field").keyup(toggleConfirmButton);

$("button.confirm").prop("disabled", true);

// transform context string into clickable objects
$("button.confirm").click(function () {
  $("button.cancel").css("display", "block");
  $(this).hide();
  $("div.context_display").show();
  $("#context_field").hide();
  $("p.hint").text("请选择要查询的单词");
  var context = new Context($("#context_field").val());
  context.transformDisplay();
});

$("button.cancel").click(function () {
  $("button.confirm").css("display", "block");
  $(this).hide();
  $("#context_field").show();
  $("div.context_display").hide();
  $("div.context_display").empty();
  $("p.hint").text("请输入单词所在的上下文");
});

