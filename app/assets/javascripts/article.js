(function(Article, $) {
  var $badge;
  var numComments;

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
    },
    test : function() {
      console.log("testing...");
    }
  }
  Article.comment.test();
  return Article;

})(Article = window.Article || {}, jQuery);

// articles / comments events
Article.ready = function() {
  Article.comment.showArticleCommentSection();
  $('.article-comments-visibility > span').on('click', function() {
    console.log("hello");
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
    console.log("im here");
    var $numCharactersWrapper = $(this).closest('.articles-comments-form').find($('.number-of-characters-in-comment-wrapper'));
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
