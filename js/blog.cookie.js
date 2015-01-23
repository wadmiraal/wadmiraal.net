/**
 * @file
 * Blog Cookie policy.
 */

(function( document, blog ) {

  blog.cookie = blog.cookie || {};

  // Get the set cookie value.
  blog.cookie.getValue = function() {
    // Check if the cookie was set.
    if ( /partyPooper/.test( document.cookie ) ) {
      // Get the value.
      return /partyPooper=1/.test( document.cookie );
    } else {
      return undefined;
    }
  };

  // Set the cookie value.
  blog.cookie.setValue = function( value ) {
    document.cookie = 'partyPooper=' + ( value ? 1 : 0 ) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT;';
  };

  // Ask the question.
  blog.cookie.ask = function() {
    var question = document.createElement( 'div' ),
        yes = document.createElement( 'a' ),
        no = document.createElement( 'a' );

    question.id = 'cookie-question';
    question.setAttribute( 'class', 'site-cookie-question' );
    question.innerHTML = "I use <a target='_blank' href='https://www.google.ch/search?q=cookies&tbm=isch'>cookies</a>, just to track visits. No personal details are stored. ";

    yes.setAttribute( 'class', 'site-cookie-question__button site-cookie-question__button--yes' );
    yes.setAttribute( 'href', 'javascript:void(0);' );
    yes.innerHTML = 'I accept the cookies. Great blog, by the way.';
    yes.addEventListener( 'click', function() {
      blog.cookie.setValue( 1 );

      // Reload page.

      blog.cookie.hideQuestion();

      return false;
    }, false );

    no.setAttribute( 'class', 'site-cookie-question__button site-cookie-question__button--no' );
    no.setAttribute( 'href', 'javascript:void(0);' );
    no.innerHTML = 'Ah, nope. Stalker.';

    no.addEventListener( 'click', function() {
      blog.cookie.setValue( 0 );      
      blog.cookie.hideQuestion();
      return false;
    }, false );

    question.appendChild( yes );
    question.appendChild( no );

    document.body.appendChild( question );
  };

  // Hide the question.
  blog.cookie.hideQuestion = function() {
    var question = document.getElementById( 'cookie-question' );
    question.parentNode.removeChild( question );
  };

  // Initialize logic.
  blog.cookie.init = function() {
    // Check if the user already set a cookie. If not, present her with the
    // famous Yes Or No question.
    if ( blog.cookie.getValue() === undefined ) {
      blog.cookie.ask();
    }
  };

})( document, window.blog !== undefined ? window.blog : window.blog = {} );
