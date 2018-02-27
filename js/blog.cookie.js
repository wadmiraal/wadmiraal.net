/**
 * @file
 * Blog Cookie policy.
 */

(function( document, blog ) {

  blog.cookie = blog.cookie || {};

  // Get the set cookie value.
  blog.cookie.getValue = function() {
    // Check if the cookie was set.
    if ( /stealthMode/.test( document.cookie ) ) {
      // Get the value.
      return /stealthMode=1/.test( document.cookie );
    } else {
      return undefined;
    }
  };

  // Expire old cookies.
  // Before, we let people decide if they wished to be tracked or not. Now, we
  // just let them now they will get tracked, period. For the really geeky ones,
  // they can always control the tracking by changing the cookie value :-).
  // We'll give them that.
  blog.cookie.expireOldCookies = function() {
    // Check the cookie. If it is using the old format, expire it.
    if ( /partyPooper=\d/.test( document.cookie )) {
      document.cookie = 'partyPooper=0; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
  };

  // Set the cookie value.
  blog.cookie.setValue = function( value ) {
    document.cookie = 'stealthMode=' + ( value ? 1 : 0 ) + '; expires=Fri, 31 Dec 9000 23:59:59 GMT; path=/;';
  };

  // Ask the question.
  blog.cookie.ask = function() {
    var question = document.createElement( 'div' ),
        yes = document.createElement( 'a' ),
        no = document.createElement( 'a' );

    question.id = 'cookie-question';
    question.setAttribute( 'class', 'site-cookie-question' );
    question.innerHTML = "I use <a target='_blank' href='http://www.allaboutcookies.org/'>cookies</a>, just to track visits. No personal details are stored. ";

    yes.setAttribute( 'class', 'site-cookie-question__button site-cookie-question__button--yes' );
    yes.setAttribute( 'href', 'javascript:void(0);' );
    yes.innerHTML = 'Got it. Great blog, by the way.';
    yes.addEventListener( 'click', function() {
      blog.cookie.setValue( 0 );

      blog.cookie.hideQuestion();

      return false;
    }, false );

    no.setAttribute( 'class', 'site-cookie-question__button site-cookie-question__button--no' );
    no.setAttribute( 'href', 'https://duckduckgo.com/' );
    no.innerHTML = 'Heck no! Beam me up, Scotty!';

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
    // Delete old cookies.
    blog.cookie.expireOldCookies();

    // Check if the user already set a cookie. If not, present her with the
    // famous Yes Or No question.
    if ( blog.cookie.getValue() === undefined ) {
      blog.cookie.ask();
    }
  };

})( document, window.blog !== undefined ? window.blog : window.blog = {} );
