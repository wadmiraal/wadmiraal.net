/**
 * @file
 * Gulp task file.
 *
 * @link http://gulpjs.com/ See GulpJS for more information @endlink.
 */

var gulp = require( 'gulp' );
var compass = require( 'gulp-compass' );
var jekyll = require( 'gulp-jekyll' );

// Compile the SCSS files using Compass.
gulp.task( 'compass', function() {
  gulp.src( './sass/*.scss' )
    .pipe( compass({
      style: 'compressed',
      sass: 'sass',
      css: 'jekyll-src/css',
      image: 'jekyll-src/img'
    }))
    .pipe( gulp.dest( 'tmp' ) );
});

// Default tasks.
gulp.task( 'default', [ 'compass' ]);
