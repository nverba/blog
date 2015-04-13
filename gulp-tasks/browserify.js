// BUILD JAVASCRIPT 

var gulp       = require('gulp');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var streamify  = require('gulp-streamify');
var source     = require('vinyl-source-stream');

gulp.task('browserify', function() {

  var bundleStream = browserify({ entries: './src/js/app.js', debug: true }).bundle();
 
  bundleStream
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build/js'));
});
