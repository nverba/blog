// BUILD JAVASCRIPT 

var gulp       = require('gulp');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var streamify  = require('gulp-streamify');
var source     = require('vinyl-source-stream');

gulp.task('build:js', function() {

  var bundleStream = browserify({ entries: './src/js/app.js', debug: false }).bundle();
 
  bundleStream
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('watch:js', ['build:js'], function() {
  gulp.watch(['components/**/*', 'src/**/*', 'node_modules/angular-new-router/dist/router.es5.js'], ['build:js']);
});
