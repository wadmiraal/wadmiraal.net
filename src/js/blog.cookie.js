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
  // We changed the value of the cookie.
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
    question.innerHTML = "I use cookies to track visits. <a target='_blank' href='/privacy/' title='This link will open in a new window, and take you to the Privacy Policy page.'>You can read more about what these cookies are for here</a>.";

    yes.setAttribute( 'class', 'site-cookie-question__button site-cookie-question__button--yes' );
    yes.setAttribute( 'href', 'javascript:void(0);' );
    yes.innerHTML = 'Got it. Great blog, by the way.';
    yes.addEventListener( 'click', function() {
      blog.cookie.setValue( 0 );

      blog.cookie.hideQuestion();

      blog.cookie.track();

      return false;
    }, false );

    no.setAttribute( 'class', 'site-cookie-question__button site-cookie-question__button--no' );
    no.setAttribute( 'href', 'javascript:void(0);' );
    no.innerHTML = 'Heck no! Enable stealth mode!';
    no.addEventListener( 'click', function() {
      blog.cookie.setValue( 1 );

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

  // Perform the tracking.
  blog.cookie.track = function() {
    // This is simply a verbatim copy-paste of the code Google provides, with
    // the extra line to anonymize IP addresses.
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-39415395-1', 'auto');
    ga('set', 'anonymizeIp', true);
    ga('send', 'pageview');
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
