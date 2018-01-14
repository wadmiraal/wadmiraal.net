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

// Minify the generated HTML.
gulp.task( 'html-min', function() {
  gulp.src( './jekyll-src/_site/**/*.html' )
    .pipe( minifyHTML() )
    .pipe( gulp.dest( './jekyll-src/_site/' ) );
});

// Move and minify the layout templates.
gulp.task( 'layouts', function() {
  gulp.src( './templates/layouts/*.html' )
    .pipe( gulp.dest( './jekyll-src/_layouts' ) );
});

// Watch files for changes.
gulp.task( 'watch', function() {
  gulp.watch( './js/*.js', [ 'js-min' ]);
  gulp.watch( [ './sass/*.scss', './sass/**/*.scss'], [ 'compass', 'css-min' ]);
  gulp.watch( [ './templates/layouts/*.html', './jekyll-src/_posts/*.markdown' ], [ 'layouts', 'jekyll', 'html-min' ]);
});

// Move images.
gulp.task( 'images', function() {
  gulp.src( './img/*' )
    .pipe( gulp.dest( './jekyll-src/img' ) );
});

// Move fonts.
gulp.task( 'fonts', function() {
  gulp.src( './css/fonts/*' )
    .pipe( gulp.dest( './jekyll-src/css/fonts' ) );
});

// Build Jekyll.
gulp.task( 'jekyll-build', shell.task([
  'jekyll build'
], { cwd: './jekyll-src' }));

// Serve Jekyll.
gulp.task( 'serve-jekyll', shell.task([
  'jekyll serve'
], { cwd: './jekyll-src' }));

// Default tasks.
// Compass runs in its own process. This means its result won't get piped
// correctly to the next tasks. For this reason, we use the gulp-run-command
// module, and run two Gulp commands in sequence.
gulp.task( 'default', run(
    [ 'gulp compass', 'gulp css-min js-min images fonts layouts' ]
));
gulp.task( 'serve', [ 'default', 'serve-jekyll' ] );
// Jekyll runs in its own process. This means its result won't get piped
// correctly to the next tasks. For this reason, we use the gulp-run-command
// module, and run two Gulp commands in sequence.
gulp.task( 'build', [ 'default' ], run(
  [ 'gulp jekyll-build', 'gulp html-min' ]
));
