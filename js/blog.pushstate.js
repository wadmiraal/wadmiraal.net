/**
 * @file
 * This file activates the AJAX navigation.
 *
 * The blog is can load pages and posts via AJAX for faster navigation on the
 * site. It uses pushState to update the page navigation.
 *
 * This depends on blog.fx.
 */

(function( document ) {

  var blog = blog || {};

  blog.pushState = blog.pushState || {};

  blog.pushState.init = function() {
    // Check if the browser is compatible with what we want to do. If not, all
    // the JS enhancements will simply be ignored.
    blog.fx.isCompatible = blog.fx.isCompatible || ( document.querySelectorAll && document.body.classList && document.body.classList.add && document.body.classList.remove );
  };

})( document );
