var gulp            = require('gulp');
var map             = require('vinyl-map');
var jsoncombine     = require('gulp-jsoncombine');
var ext_replace     = require('gulp-ext-replace');
var fm              = require('html-frontmatter');
var groupAggregate  = require('gulp-group-aggregate');
var requireDir      = require('require-dir');

requireDir('./gulp-tasks');

gulp.task('watch', ['js'], function() {
  gulp.watch(['components/**/*', 'src/*'], ['js']);
});

gulp.task('default', ['watch']);
