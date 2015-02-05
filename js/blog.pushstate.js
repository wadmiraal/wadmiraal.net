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
    var links = context.querySelectorAll( 'a[href^="/"]' ),
        ignore = [ '/feed.xml' ];

    for ( var i = links.length - 1; i >= 0; --i ) {
      (function( link ) {
        var href = link.getAttribute( 'href' );

        if ( ignore.indexOf( href ) === -1 ) {
          link.addEventListener( 'click', function( e ) {
            /*e.preventDefault();

            blog.pushState.ajax({
              url: link.href,
              success: function( xhr, e ) {
                xhr.response
              }
            });

            return false;*/
          }, false );
        }
      })( links[ i ] );
    }
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
    blog.pushState.isCompatible = blog.pushState.isCompatible || ( document.querySelectorAll && document.body.classList && document.body.classList.add && document.body.classList.remove && history.pushState && XMLHttpRequest !== undefined && typeof new XMLHttpRequest().responseType === 'string' );

    if ( blog.pushState.isCompatible ) {
      // Activate all links in the document scope for PushState fetching.
      blog.pushState.activateLinks( document );
    }
  };

})( document, window.blog !== undefined ? window.blog : window.blog = {} );
