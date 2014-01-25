
;(function($, window, undefined) {

  var $window = $(window),
      windowHeight = $window.height();

  // Make all section as high as the screen.
  $('.resume-section').each(function() {
    var $this = $(this);
    if ($this.height() < windowHeight) {
      $this.height(windowHeight);
    }
  });  

  $('.scroll-down').click(function() {
    $('html, body').animate({ scrollTop: $('a[name="pro-xp"]').offset().top  }, 'slow');
  }).addClass('js-processed');

  $('.back-to-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

})(jQuery, window);
