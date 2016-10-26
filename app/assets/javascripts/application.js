// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require turbolinks
//= require_tree .

$(document).on('turbolinks:load', function() {

  $(".exit-flash-message").click(function() {
    $(".flash-message-wrapper, .form-error-messages").css("display", "none");
  });

  if (window.innerWidth < 400) {
    $('.autofocussed').focus();
  }

  $('.articles-comments-section-toggle').click(function() {
    $('.articles-comments-section').toggle(500);
  });

  $(function() {
    $(".articles-comments-form textarea").keypress(function (e) {
      if(e.which == 13) {
        $(this).closest('form').submit();
        e.preventDefault();
      }
    });
  });

});
