var gulp = require('gulp');
var del  = require('del');

gulp.task('build:flush', function (cb) {
  del([
    'build/indexes/pages/*.*',
    'build/indexes/tags/*.*',
    'build/tags/*.*'
  ], cb);
});

gulp.task('build:flush:test', function (cb) {
  del([
    'tests/fake_data/indexes/**',
    'tests/fake_data/tags/*.*'
  ], cb);
});
