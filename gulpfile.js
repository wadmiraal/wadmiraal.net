/**
 * @file
 * Gulp task file.
 *
 * @link http://gulpjs.com/ See GulpJS for more information @endlink.
 */

var gulp       = require( 'gulp' ),
    compass    = require( 'gulp-compass' ),
    concat     = require( 'gulp-concat' ),
    minifyCSS  = require( 'gulp-minify-css' ),
    uglify     = require( 'gulp-uglify' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    shell      = require( 'gulp-shell' ),
    minifyHTML = require( 'gulp-minify-html' ),
    run        = require( 'gulp-run-command' ).default,
    a11y       = require( 'gulp-accessibility' );

// Accessibility test.
gulp.task( 'test-a11y', function() {
  gulp.src( './jekyll-src/_site/**/*.html' )
    .pipe( a11y({
      force: true
    }) )
    .on( 'error', console.log );
});

// Compile the SCSS files using Compass.
gulp.task( 'compass', function( done ) {
  gulp.src( './sass/*.scss' )
    .pipe( compass({
      style: 'expanded',
      sass: 'sass',
      css: 'css'
    }))
    .pipe( gulp.dest( 'css' ) );
  done();
});

// Combine all CSS files and minify.
gulp.task( 'css-min', function( done ) {
  // If icomoon.css is treated first, the Google Fonts @import declaration
  // in styles.css won't be at the top, and won't work correctly. Hard-code
  // the order, instead of using wildcards.
  gulp.src([ './css/styles.css', './css/icomoon.css', './css/**/*.css' ])
    .pipe( concat( 'all.min.css' ) )
    .pipe( minifyCSS({ processImport: false }) )
    .pipe( gulp.dest( './jekyll-src/css' ) );
  done();
});

// Combine all JS files and minify.
gulp.task( 'js-min', function( done ) {
  gulp.src([ './js/vendor/**/*.js', './js/*.js' ])
    .pipe( sourcemaps.init() )
    .pipe( concat( 'all.min.js' ) )
    .pipe( uglify() )
    .pipe( sourcemaps.write() )
    .pipe( gulp.dest( './jekyll-src/js' ) );
  done();
});

// Minify the generated HTML.
gulp.task( 'html-min', function( done ) {
  gulp.src( './jekyll-src/_site/**/*.html' )
    .pipe( minifyHTML() )
    .pipe( gulp.dest( './jekyll-src/_site/' ) );
  done();
});

// Move and minify the layout templates.
gulp.task( 'layouts', function( done ) {
  gulp.src( './templates/layouts/*.html' )
    .pipe( gulp.dest( './jekyll-src/_layouts' ) );
  done();
});

// Watch files for changes.
gulp.task( 'watch', function() {
  gulp.watch( './js/*.js', [ 'js-min' ]);
  gulp.watch( [ './sass/*.scss', './sass/**/*.scss'], [ 'compass', 'css-min' ]);
  gulp.watch( [ './templates/layouts/*.html', './jekyll-src/_posts/*.markdown' ], [ 'layouts', 'jekyll', 'html-min' ]);
});

// Move images.
gulp.task( 'images', function( done ) {
  gulp.src( './img/*' )
    .pipe( gulp.dest( './jekyll-src/img' ) );
  done();
});

// Move fonts.
gulp.task( 'fonts', function( done ) {
  gulp.src( './css/fonts/*' )
    .pipe( gulp.dest( './jekyll-src/css/fonts' ) );
  done();
});

// Build Jekyll.
gulp.task( 'jekyll-build', shell.task([
  'bundle exec jekyll build'
], { cwd: './jekyll-src' }));

// Serve Jekyll.
gulp.task( 'serve-jekyll', shell.task([
  'bundle exec jekyll serve --drafts'
], { cwd: './jekyll-src' }));

// Default tasks.
gulp.task( 'default', gulp.series('compass', 'css-min', 'js-min', 'images', 'fonts', 'layouts' ));
gulp.task( 'serve',  gulp.parallel( 'default', 'serve-jekyll' ) );
gulp.task( 'build', gulp.series( 'default' ,'jekyll-build', 'html-min' ));
