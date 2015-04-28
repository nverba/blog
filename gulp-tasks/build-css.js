var gulp   = require('gulp');
var sass   = require('gulp-sass');
var inject = require('gulp-inject');

gulp.task('build:scss', function () {

  return gulp.src('./src/scss/main.scss')
    .pipe(inject(
      gulp.src(['./components/**/*.scss'], {read: false}), {
        relative: true,
        starttag: '/* {{name}}:{{ext}} */',
        endtag: '/* endinject */',
        transform: function (filepath) {
          return filepath === 'main.scss' ? '' : '@import "' + filepath + '";';
        }
      }
    ))
  .pipe(gulp.dest('./src/scss/'));
});
 
gulp.task('build:css', ['build:scss'], function () {
  gulp.src('./src/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('watch:scss', ['build:scss', 'build:css'], function() {
  gulp.watch(['./components/**/*.scss'], ['build:scss', 'build:css']);
});
