/**
 * @file
 * Blog effects.
 *
 * This file defines the different UI effects, like opening the navigation
 * or activating the JS enhanced layout.
 */

(function( document, blog ) {

  blog.fx = blog.fx || {};

  // Set the global flag that this page has JS activated.
  blog.fx.setJSFlag = function() {
    var html = document.getElementsByTagName( 'html' )[ 0 ];
    html.classList.remove( 'no-js' );
    html.classList.add( 'has-js' );
  };

  // Activate the menu toggle.
  blog.fx.activateMenuToggle = function() {
    var button = blog.fx.getToggleElement();

    button.addEventListener( 'click', function( e ) {
      e.stopPropagation();

      var menu = blog.fx.getMenuElement();

      if ( menu.classList.contains( 'open' )) {
        blog.fx.closeMenu();
      } else {
        blog.fx.openMenu();
      }

      return false;
    }, false );

    // When clicking anywhere else than the toggle button, make sur we close
    // the menu.
    document.getElementsByTagName( 'body' )[ 0 ].addEventListener( 'click', function() {
      blog.fx.closeMenu();
    }, false );
  };

  // Activate the post hover logic, displaying the color-code legend.
  blog.fx.activatePostsHover = function() {
    var links = document.getElementById( 'posts-items' ).getElementsByTagName( 'a' );

    for (var i = links.length - 1; i >= 0; --i) {
      links[ i ].addEventListener( 'mouseover', function( e ) {
        var post = e.srcElement;

        // Get the main tag (first in the list).
        var tag = post.getAttribute( 'data-tags' ).split( ' ' )[ 0 ];
        blog.fx.showLegendForTag( tag );
      }, false );

      links[ i ].addEventListener( 'mouseout', function() {
        blog.fx.hideLegend();
      }, false );
    }
  };

  // Activate scrolling.
  blog.fx.activateScroll = function() {
    if ( window.tinyscrollbar !== undefined ) {
      var menu = document.getElementById( 'scroll-wrapper' );
      menu.classList.add( 'js-scroll-enabled' );
      tinyscrollbar( menu );
    }
  };

  // On clicking on a tag, we activate the menu display for that tag only.
  blog.fx.activateTagLinks = function( context ) {
    var tags = context.querySelectorAll( '[data-tag]' );

    for ( var i = tags.length - 1; i >= 0; --i ) {
      tags[ i ].addEventListener( 'click', function( e ) {
        e.stopPropagation();

        var link = e.srcElement;

        blog.fx.showPostsTaggedWith( link.getAttribute( 'data-tag' ) );
        blog.fx.openMenu();
      }, false );
    }
  };

  // Show all posts tagged with a specific tag.
  blog.fx.showPostsTaggedWith = function( tag ) {
    var menu = document.getElementById( 'posts-menu' );
    menu.setAttribute( 'data-show-posts-tagged-with', tag );
  };

  // Deactivate showing all posts with a specific tag.
  blog.fx.hidePostsTaggedWith = function() {
    var menu = blog.fx.getMenuElement();
    menu.setAttribute( 'data-show-posts-tagged-with', '' );
  };

  // Open the menu.
  blog.fx.openMenu = function() {
    var menu = blog.fx.getMenuElement();
    menu.classList.add( 'open' );
  };

  // Close the menu.
  blog.fx.closeMenu = function() {
    var menu = blog.fx.getMenuElement();
    menu.classList.remove( 'open' );

    // Disable the "show tags".
    blog.fx.hidePostsTaggedWith();
  };

  // Show legend for a specific tag.
  blog.fx.showLegendForTag = function( tag ) {
    var container = blog.fx.getLegendsContainer();
    container.setAttribute( 'data-show-legend-for', tag );
  };

  // Hide legend.
  blog.fx.hideLegend = function() {
    var container = blog.fx.getLegendsContainer();
    container.setAttribute( 'data-show-legend-for', '' );
  };

  // Get the menu element.
  blog.fx.getMenuElement = function() {
    if ( blog.fx.getMenuElement._menu === undefined ) {
      blog.fx.getMenuElement._menu = document.getElementById( 'posts-menu' );
    }
    return blog.fx.getMenuElement._menu;
  };

  // Get the toggle button.
  blog.fx.getToggleElement = function() {
    if ( blog.fx.getToggleElement._button === undefined ) {
      blog.fx.getToggleElement._button = document.getElementById( 'menu-toggle' );
    }
    return blog.fx.getToggleElement._button;
  };

  // Get the legends container.
  blog.fx.getLegendsContainer = function() {
    if ( blog.fx.getLegendsContainer._container === undefined ) {
      blog.fx.getLegendsContainer._container = document.getElementById( 'posts-tag-legends' );
    }
    return blog.fx.getLegendsContainer._container;
  };

  // Initialize logic.
  blog.fx.init = function() {
    // Check if the browser is compatible with what we want to do. If not, all
    // the JS enhancements will simply be ignored.
    blog.fx.isCompatible = blog.fx.isCompatible || ( document.querySelectorAll && document.body.classList && document.body.classList.add && document.body.classList.remove );

    if ( blog.fx.isCompatible ) {
      blog.fx.setJSFlag();
      blog.fx.activateMenuToggle();
      blog.fx.activatePostsHover();
      blog.fx.activateTagLinks( document.getElementById( 'site-content' ) );
      blog.fx.activateScroll();
    }
  };

})( document, window.blog !== undefined ? window.blog : window.blog = {} );
