/**
 * @file
 * This file activates the AJAX navigation.
 *
 * The blog can load pages and posts via AJAX for faster navigation on the
 * site. It uses pushState to update the page navigation.
 */

(function( document, blog ) {

  blog.pushState = blog.pushState || {};

  // Activate the links in the provided context for PushState.
  blog.pushState.activateLinks = function( context ) {
    // We only handle internal links. Links that point to other websites
    // are ignored.
    var links = context.querySelectorAll( 'a[href^="/"]' );

    console.log(links)
  };

  // Provide a simple AJAX mechanism.
  blog.pushState.ajax = function( options ) {
    // We need at least an URL.
    if ( options.url === undefined ) {
      return;
    }

    var defaults = {
      method: 'GET',
      success: function() { /* noop */ },
      error: function() { /* noop */ }
    };

    for ( var setting in defaults ) {
      if ( options[ setting ] === undefined ) {
        options[ setting ] = defaults[ setting ];
      }
    }

    var xhr = new XMLHttpRequest();

    xhr.open( options.method, options.url, true );

    xhr.onload = function( e ) {
      if ( this.status == 200 ) {
        options.success( this, e );
      } else {
        options.error( this, e );
      }
    };

    xhr.send();
  };

  // Initialize the logic.
  blog.pushState.init = function() {
    // Check if the browser is compatible with what we want to do. If not, all
    // the JS enhancements will simply be ignored.
    blog.pushState.isCompatible = blog.pushState.isCompatible || ( document.querySelectorAll && document.body.classList && document.body.classList.add && document.body.classList.remove && XMLHttpRequest !== undefined && typeof new XMLHttpRequest().responseType === 'string' );

    if ( blog.pushState.compatible ) {
      // Activate all links in the document scope for PushState fetching.
      blog.pushState.activateLinks( document );
    }
  };

})( document, window.blog !== undefined ? window.blog : window.blog = {} );
