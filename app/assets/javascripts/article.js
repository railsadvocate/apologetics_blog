(function(Article, $) {
  var $badge;
  var numComments;

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
  }

  Article.handleNextCharacter = function(markdownText, currentState) {
    switch(markdownText[currentState.indexOfCurrent]) {
    case '-':
      switch (markdownText[currentState.indexOfCurrent + 1]) {
        case '-':
          if (markdownText[currentState.indexOfCurrent + 2] === '-') {
            currentState.indexOfCurrent += 2;
            currentState.plainTextBuilder += "<hr>";
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
      if (markdownText[currentState.indexOfCurrent + 1] == '\n') {
        currentState.plainTextBuilder += "</p><p>";
        currentState.indexOfCurrent += 1;
      }
      else {
        currentState.plainTextBuilder += "<br>";
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
    currentState.plainTextBuilder = "<p>";
    currentState.tokenStack = new Stack();

    for (currentState.indexOfCurrent = 0; currentState.indexOfCurrent < markdownText.length; currentState.indexOfCurrent += 1) {
      currentState = Article.handleNextCharacter(markdownText, currentState);
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

  $('.submit-updated-article-comment').on('click', function(e) {
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
}
