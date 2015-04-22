var gulp = require('gulp');
var requireDir = require('require-dir')('./gulp-tasks');

var replace = require('gulp-replace');

gulp.task('trace', function(){
  gulp.src(['node_modules/angular-new-router/dist/router.es5.js'])
    .pipe(replace(/(function.+)({)/g, '$1 { console.log(arguments);'))
    .pipe(gulp.dest('build'));
});


