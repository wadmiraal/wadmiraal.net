/**
 * @file
 * Gulp task file.
 *
 * @link http://gulpjs.com/ See GulpJS for more information @endlink.
 */

var gulp      = require( 'gulp' ),
    compass   = require( 'gulp-compass' ),
    concat    = require( 'gulp-concat' ),
    minifyCSS = require( 'gulp-minify-css' ),
    uglify    = require( 'gulp-uglify' );

// Compile the SCSS files using Compass.
gulp.task( 'compass', function() {
  gulp.src( './sass/*.scss' )
    .pipe( compass({
      style: 'compressed',
      sass: 'sass',
      css: 'tmp',
      image: 'jekyll-src/img'
    }))
    .pipe( gulp.dest( 'tmp' ) );
});

// Combine all CSS files and minify.
gulp.task( 'css-min', function() {
  gulp.src([ './tmp/*.css', './css/**/*.css' ])
    .pipe( concat( 'all.min.css' ) )
    .pipe( minifyCSS() )
    .pipe( gulp.dest( './jekyll-src/css/' ) );
});

// Combine all JS files and minify.
gulp.task( 'js-min', function() {
  gulp.src([ './js/vendor/**/*.js', './js/*.js' ])
    .pipe( concat( 'all.min.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( './jekyll-src/js' ) )
});

// Default tasks.
gulp.task( 'default', [ 'compass', 'css-min', 'js-min' ]);
