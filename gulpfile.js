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
      style: 'expanded',
      sass: 'sass',
      css: 'css',
    }))
    .pipe( gulp.dest( 'css' ) );
});

// Combine all CSS files and minify.
gulp.task( 'css-min', function() {
  gulp.src([ './css/**/*.css', './css/*.css' ])
    .pipe( concat( 'all.min.css' ) )
    .pipe( minifyCSS() )
    .pipe( gulp.dest( './jekyll-src/css' ) );
});

// Combine all JS files and minify.
gulp.task( 'js-min', function() {
  gulp.src([ './js/vendor/**/*.js', './js/*.js' ])
    .pipe( concat( 'all.min.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( './jekyll-src/js' ) );
});

// Move and minify the layout templates.
gulp.task( 'layouts', function() {
  gulp.src( './templates/layouts/*.html' )
    .pipe( gulp.dest( './jekyll-src/_layouts' ));
});

// Watch files for changes.
gulp.task( 'watch', function() {
  gulp.watch( './js/*.js', [ 'js-min' ]);
  gulp.watch( [ './sass/*.scss', './sass/**/*.scss'], [ 'compass', 'css-min' ]);
});

// Move images.
gulp.task( 'images', function() {
  gulp.src( './img/*' )
    .pipe( gulp.dest( './jekyll-src/img' ));
});

// Move fonts.
gulp.task( 'fonts', function() {
  gulp.src( './css/fonts/*' )
    .pipe( gulp.dest( './jekyll-src/css/fonts' ));
});

// Default tasks.
gulp.task( 'default', [ 'compass', 'css-min', 'js-min', 'images', 'fonts', 'layouts' ]);
