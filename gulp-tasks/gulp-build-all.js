var gulp = require('gulp');

gulp.task('build', ['build:flush', 'build:index', 'build:tags']);
gulp.task('default', ['build']);
