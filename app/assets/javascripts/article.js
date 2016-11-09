(function(Article, $) {
  var $badge;
  var numComments;

  Article.rotatedDegrees = 0;

  Article.searchForEndOfString = function(currentState, markdownText, pattern, patternTerminator) {
    endOfString = false;
    var pattern;
    for (currentState.indexOfCurrent; currentState.indexOfCurrent < markdownText.length && !endOfString; currentState.indexOfCurrent += 1) {
      pattern = currentState.tokenStack.nextToken();
      switch(markdownText[currentState.indexOfCurrent]) {
      case pattern[0]:
        if (pattern.length === 2) {
          switch(markdownText[currentState.indexOfCurrent + 1]) {
          case pattern[1]:
            currentState.plainTextBuilder += patternTerminator;
            endOfString = true;
            break;
          default:
            //currentState.plainTextBuilder += markdownText[currentState.indexOfCurrent];
            currentState = Article.handleNextCharacter(mardownText, currentState);
            break;
          }
        }
        else {
          // found end of pattern!
          currentState.plainTextBuilder += patternTerminator;
        }
        break;
      default:
        currentState = Article.handleNextCharacter(markdownText, currentState);
        //currentState.plainTextBuilder += markdownText[currentState.indexOfCurrent];
        break;
      }
    }
    return currentState;
  }

  Article.isValidListItem = function(markdownText, currentState) {
    var li = markdownText[currentState.indexOfCurrent + 1];
    var isHr = markdownText.substring(currentState.indexOfCurrent + 1, currentState.indexOfCurrent + 4) == "---";
    var valid;
    if (!isHr) {
      valid = (li === '-' || !isNaN(parseInt(li)));
      return valid;
    }
    return false;
  }

  Article.findCorrectOpenTag = function(markdownText, index, currentState) {
    var li = markdownText[index];
    if (li === '-') {
      currentState.currentListTag = "ul";
      currentState.plainTextBuilder += "<ul><li>";
      return currentState;
    }
    else {
      currentState.currentListTag = "ol";
      currentState.plainTextBuilder += "<ol><li>";
      return currentState;
    }
  };

  Article.findCorrectCloseTag = function(currentState) {
    if (currentState.currentListTag == "ul") {
      currentState.plainTextBuilder += "</li></ul>";
    }
    else {
      currentState.plainTextBuilder += "</li></ol>";
    }
    currentState.currentListTag = "";
    return currentState;
  };

  Article.performStackOperation = function(pattern, tag, currentState) {
    var closing_tag = tag.slice(0,1) + '/' + tag.slice(1,tag.length);
    if (pattern === currentState.tokenStack.peek()) {
      currentState.tokenStack.pop();
      currentState.plainTextBuilder += closing_tag;
    }
    else {
      currentState.tokenStack.push(pattern);
      currentState.plainTextBuilder += tag;
    }
    return currentState;
  };

  Article.checkForList = function(markdownText, currentState) {
    while (markdownText[currentState.indexOfCurrent + 1] === ' ') {
      currentState.plainTextBuilder += markdownText[currentState.indexOfCurrent + 1];
      currentState.indexOfCurrent += 1;
    }
    if (Article.isValidListItem(markdownText, currentState)) {
      console.log("here");
      if (currentState.activeList) {
        currentState.plainTextBuilder += "</li><li>";
        if (currentState.currentListTag == "ol") {
          currentState.indexOfCurrent += 1;
        }
      }
      else {
        currentState.activeList = true;
        currentState = Article.findCorrectOpenTag(markdownText, currentState.indexOfCurrent+1, currentState);
        if (currentState.currentListTag == "ol") {
          currentState.indexOfCurrent += 1;
        }
      }
    }
    else {
      if (currentState.activeList) {
        currentState = Article.findCorrectCloseTag(currentState);
        currentState.activeList = false;
        currentState.nobreak = true;
      }
    }
    return currentState;
  };

  Article.findHeaderSize = function(markdownText, currentState) {
    while (markdownText[currentState.indexOfCurrent] === '#') {
      currentState.headerSize += 1;
      currentState.indexOfCurrent += 1;
    }
    return currentState;
  };

  Article.addHeaderTag = function(currentState) {
    var headerTag;
    var closingTag;
    switch (parseInt(currentState.headerSize)) {
      case 1:
        headerTag = "<h1>";
        closingTag = "</h1>";
        break;
      case 2:
        headerTag = "<h2>";
        closingTag = "</h2>";
        break;
      case 3:
        headerTag = "<h3>";
        closingTag = "</h3>";
        break;
      case 4:
        headerTag = "<h4>";
        closingTag = "</h4>";
        break;
      case 5:
        headerTag = "<h5>";
        closingTag = "</h5>";
        break;
      case 6:
        headerTag = "<h6>";
        closingTag = "</h6>";
        break;
      default:
        headerTag = "<h6>";
        closingTag = "</h6>";
        break;
    }
    currentState.plainTextBuilder += headerTag;
    currentState.headingCloseTag = closingTag;
    currentState.headerSize = 0;
    return currentState;
  };

  Article.scanHyperlinkText = function(markdownText, currentState) {
    
  };

  Article.handleNextCharacter = function(markdownText, currentState) {
    switch(markdownText[currentState.indexOfCurrent]) {
    case '[':
      currentState.indexOfCurrent += 1;
      currentState = Article.scanHyperlinkText(markdownText, currentState);
      break;
    case '#':
      currentState.currentHeader = true;
      currentState = Article.findHeaderSize(markdownText, currentState);
      currentState = Article.addHeaderTag(currentState);
      break;
    case '-':
      switch (markdownText[currentState.indexOfCurrent + 1]) {
        case '-':
          if (markdownText[currentState.indexOfCurrent + 2] === '-') {
            currentState.indexOfCurrent += 2;
            currentState.plainTextBuilder += "<hr>";
            currentState.nobreak = true;
          }
          break;
        default:
          break;
      }
      break;
    case '\n':
      // first character is always a break for some reason..
      if (currentState.indexOfCurrent == 0) {
        return currentState;
      }
      if (currentState.currentHeader) {
        currentState.currentHeader = false;
        currentState.plainTextBuilder += currentState.headingCloseTag;
        currentState.nobreak = true;
      }
      if (markdownText[currentState.indexOfCurrent + 1] == '\n') {
        if (currentState.activeList) {
          currentState.activeList = false;
          currentState = Article.findCorrectCloseTag(currentState);
        }
        currentState.plainTextBuilder += "</p><p>";
        currentState.indexOfCurrent += 1;
        currentState = Article.checkForList(markdownText, currentState);
      }
      else {
        currentState = Article.checkForList(markdownText, currentState);
        if (!currentState.activeList && !currentState.nobreak) {
          currentState.nobreak = false;
          currentState.plainTextBuilder += "<br>";
        }
      }
      break;
    case '*':
      switch (markdownText[currentState.indexOfCurrent + 1]) {
      case '*':
        currentState = Article.performStackOperation('**', "<strong>", currentState);
        currentState.indexOfCurrent += 1;
        break;
      default:
        currentState = Article.performStackOperation('*', "<em>", currentState);
        break;
      }
      break;
    case '_':
      switch (markdownText[currentState.indexOfCurrent + 1]) {
        case '_':
          currentState = Article.performStackOperation('__', "<strong>", currentState);
          currentState.indexOfCurrent += 1;
          break;
        default:
          currentState = Article.performStackOperation('_', "<em>", currentState);
          break;
      }
      break;
    default:
      currentState.plainTextBuilder += markdownText[currentState.indexOfCurrent];
      break;
    }
    return currentState;
  }

  Article.convertMarkdownToText = function(articleBody) {
    var markdownText = articleBody.text();
    var currentState = {};
    currentState.activeList = false;
    currentState.plainTextBuilder = "<p>";
    currentState.tokenStack = new Stack();
    currentState.nobreak = false;
    currentState.currentHeader = false;
    currentState.headerSize = 0;
    currentState.headingCloseTag = "";
    currentState.hyperlinkText = "";

    for (currentState.indexOfCurrent = 0; currentState.indexOfCurrent < markdownText.length; currentState.indexOfCurrent += 1) {
      currentState = Article.handleNextCharacter(markdownText, currentState);
    }

    if (currentState.activeList) {
      currentState.activeList = false;
      currentState = Article.findCorrectCloseTag(currentState);
    }
    currentState.plainTextBuilder += "</p>";
    console.log(currentState.plainTextBuilder);
    articleBody.html(currentState.plainTextBuilder);
  }

  Article.comment = {
    showArticleCommentSection : function() {
      $('.articles-comments-section').each(function() {
        $badge = $(this).find('.badge');
        numComments = parseInt($badge.text());
        if (numComments > 0) {
          $badge.closest('section').css("display", "block");
        }
      });
    },

    isValidNumberOfcharacters : function(commentLength) {
      return commentLength >= 5 && commentLength <= 100? true : false;
    },

    updateNumCharactersField : function(selector, additionalChar) {
      var $numCharactersField = selector.closest('.articles-comments-form').find('.number-of-characters-in-comment');
      var numCharacters = selector.val().replace(/ /g, "").length;
      $numCharactersField.html(numCharacters);
    },

    placeCursorAtEndOfInput : function($selector) {
      var tempVal = $selector.val();
      $selector.val('');
      $selector.val(tempVal);
    },

    submitCommentIfValid : function($selector, e) {
      var comment = $selector.val();
      var commentLengthWithoutWhitespace = comment.replace(/ /g, "").length;
      if (!Article.comment.isValidNumberOfcharacters(commentLengthWithoutWhitespace)) {
        $selector.css("border", "1px solid red");
        $selector.closest('.articles-comments-form').find('.article-comment-form-error').fadeIn();
        $selector.closest('.articles-comments-form').find('.article-comment-form-error').html("Comment must be between 1 and 100 characters");
      }
      else {
        $selector.closest('form').submit();
      }
      e.preventDefault();
    }
  }
  return Article;

})(Article = window.Article || {}, jQuery);

// articles / comments events
Article.ready = function() {
  Article.convertMarkdownToText($('#articles-show-articleBody'));
  Article.comment.showArticleCommentSection();
  $('.article-comments-visibility > span').on('click', function() {
    var $commentsVisibility = $(this).closest('header').find('span:first-child');
    $commentsVisibility.html($commentsVisibility.html() == 'View comments' ? 'Hide comments' : 'View comments');
    $(this).closest('article').find('.article-comments-body').toggle(500);
  });

  $(".submit-updated-article-comment").on('click', function(e) {
    Article.comment.submitCommentIfValid($(this).closest('.modal-content').find('textarea'), e);
  });

  $('.edit-article-comment').on("click", function() {
    $('.edit-article-comment').blur();
    $(this).find('textarea').focus();
  });

  $('.articles-comments-form textarea').keyup(function(e) {
    Article.comment.updateNumCharactersField($(this), 0);
  });

  $('.articles-comments-form textarea').on("focus", function() {
    var $numCharactersWrapper = $(this).closest('.articles-comments-form').find($('.articles-addComment'));
    var numCharacters = $(this).val().replace(/ /g, "").length;
    Article.comment.placeCursorAtEndOfInput($(this));
    if ($numCharactersWrapper.css("display") === "none") {
      $numCharactersWrapper.fadeIn();
    }
    if (parseInt(numCharacters) > 0) {
      $(this).closest('.articles-comments-form').find('.number-of-characters-in-comment').text(numCharacters);
    }
  });

  $(".articles-comments-form textarea").keypress(function (e) {
    Article.comment.updateNumCharactersField($(this), 1);
    if(e.which == 13) {
      Article.comment.submitCommentIfValid($(this), e);
    }
  });

  Article.getRotationDegrees = function(obj) {
    var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform")    ||
      obj.css("-ms-transform")     ||
      obj.css("-o-transform")      ||
      obj.css("transform");
    if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
  };

  $('.example-markdown-expand').on('click', function() {
    var degreesRotated = Article.getRotationDegrees($(this).find('span'));
    $(this).closest('.markdown-item').find('.example-markdown').fadeToggle(300);
    if (degreesRotated === 90) {
      $(this).find('span').css("transform", "rotate(0deg)");
      Article.rotatedDegrees -= 90;
    }
    else {
      $(this).find('span').css("transform", "rotate(90deg)");
      Article.rotatedDegrees =+ 90;
    }
  });
};
