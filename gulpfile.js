/**
 * @file
 * Gulp task file.
 *
 * @link http://gulpjs.com/ See GulpJS for more information @endlink.
 */

var gulp       = require( 'gulp' ),
    sass       = require( 'gulp-sass' ),
    concat     = require( 'gulp-concat' ),
    minifyCSS  = require( 'gulp-minify-css' ),
    uglify     = require( 'gulp-uglify' ),
    shell      = require( 'gulp-shell' ),
    minifyHTML = require( 'gulp-minify-html' ), 
    path       = require( 'path' ),
    permalink  = require( 'assemble-permalinks' ),
    assemble   = require( 'assemble' )(), // Careful: this is a constructor!
    buildDir   = './_build';

// Compile the SCSS files.
gulp.task( 'sass', function() {
  gulp.src( './sass/*.scss' )
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( gulp.dest( './css' ) );
} );

// Combine all CSS files and minify.
gulp.task( 'css-min', function() {
  gulp.src([ './css/**/*.css', './css/*.css' ])
    .pipe( concat( 'all.min.css' ) )
    .pipe( minifyCSS() )
    .pipe( gulp.dest( buildDir + '/css' ) );
} );

// Combine all JS files and minify.
gulp.task( 'js-min', function() {
  gulp.src([ './js/vendor/**/*.js', './js/*.js' ])
    .pipe( concat( 'all.min.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( buildDir + '/js' ) );
} );

// Watch files for changes.
gulp.task( 'watch', function() {
  gulp.watch( './js/*.js', [ 'js-min' ]);
  gulp.watch( [ './sass/*.scss', './sass/**/*.scss'], [ 'sass', 'css-min' ]);
  gulp.watch( [ './layouts/*.hbs', './pages/*.md', './posts/*.md' ], [ 'assemble' ]);
} );

// Move images.
gulp.task( 'images', function() {
  gulp.src( './img/*' )
    .pipe( gulp.dest( buildDir + '/img' ) );
} );

// Move fonts.
gulp.task( 'fonts', function() {
  gulp.src( './css/fonts/*' )
    .pipe( gulp.dest( buildDir + '/css/fonts' ) );
} );

// Run Assemble.
// This main task builds both collections.
gulp.task( 'assemble', [ 'assemble-pages', 'assemble-posts' ], function( cb ) {
  cb();
} );

// Load all global data, register layouts, helpers, etc.
gulp.task( 'assemble-load', function( cb ) {
  // Register the layouts.
  assemble.layouts( './layouts/*.hbs' );

  // Create a tag collection. This will contain all tags across all blog posts.
  var tags = ['yo', 'hello there']

  // Register Handlebars helpers.
  assemble.engine( 'hbs' ).Handlebars.registerHelper( 'render_tag', function() {
    return this.toLowerCase().replace( ' ', '-' );
  } );

  // Set the template variables that should be available across all pages and 
  // posts.
  const tplVars = {
    site_tags: tags,
    // site_posts: assemble.posts
  };

  // Store them globally.
  assemble._tplVars = tplVars;

  cb();
} );

// Build pages.
gulp.task( 'assemble-pages', [ 'assemble-load' ], function( cb ) {
  // Set the sources, and register permalinks helpers.
  assemble.pages( './pages/*.md' );

  return push( 'pages' )
    .pipe( assemble.renderFile( assemble._tplVars ) )
    //.pipe( minifyHTML() )
    .pipe( permalink( ':basename/' ) )
    .pipe( assemble.dest( buildDir ) );
} );

// Build blog posts.
gulp.task( 'assemble-posts', [ 'assemble-load' ], function( cb ) {
  // Set the sources, and register permalinks helpers.
  const posts = assemble.create( 'posts' )
    .use( permalink( '/lore/:year/:month/:day/:title/', {
      parsePath( path ) {
        // Parse the date from the file name, and allow its parts to be used in 
        // the permalink.
        const date = path.basename.match( /^(\d+)-(\d+)-(\d+)/ );
        path.day = date[3];
        path.month = date[2];
        path.year = date[1];

        // Get the title from the filename.
        path.title = path.basename.match( /^(\d+-){3}(.+)\..+$/ )[2];
      }
    } ) );
  posts.src( './posts/*.md' );

  return assemble.toStream( 'posts' )
    .pipe( assemble.renderFile() )
    //.pipe( minifyHTML() )
    .pipe( posts.dest( function( file ) {
      file.path = buildDir + file.data.permalink + 'index.html';
      return buildDir;
    } ) );
} );

// Default tasks.
gulp.task( 'default', [ 'sass', 'css-min', 'js-min', 'images', 'fonts', 'assemble' ] );
gulp.task( 'build', [ 'default' ] );
gulp.task( 'serve', [ 'default' ] );
