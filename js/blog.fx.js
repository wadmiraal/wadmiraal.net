/**
 * @file
 * Blog effects.
 *
 * This file defines the different UI effects, like opening the navigation
 * or activating the JS enhanced layout.
 */

(function( document ) {

  var blog = blog || {};

  blog.fx = blog.fx || {};

  // Set the global flag that this page has JS activated.
  blog.fx.setJSFlag = function() {
    var html = document.getElementsByTagName( 'html' )[ 0 ];
    html.classList.remove( 'no-js' );
    html.classList.add( 'has-js' );
  };

  // On clicking on a tag, we activate the menu display for that tag only.
  blog.fx.activateTagLinks = function( context ) {
    var tags = context.querySelectorAll( '[data-tag]' );

    for ( var i = tags.length; i >= 0; --i ) {
      tags[ i ].addEventListener( 'click', function( e ) {
        blog.fx.showPostsTaggedWith(); // @todo
      }, false );
    }
  };

  // Show all posts tagged with a specific tag.
  blog.fx.showPostsTaggedWith = function( tag ) {
    // @todo;
  }

  // Initialize logic.
  blog.fx.init = function() {
    // Check if the browser is compatible with what we want to do. If not, all
    // the JS enhancements will simply be ignored.
    blog.fx.isCompatible = blog.fx.isCompatible || ( document.querySelectorAll && document.body.classList && document.body.classList.add && document.body.classList.remove );
console.log(blog.fx.isCompatible)
    if ( blog.fx.isCompatible ) {
      blog.fx.setJSFlag();
    }
  };

  // @todo
  window.blog = blog;

})( document );
