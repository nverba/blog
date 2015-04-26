var gulp   = require('gulp');
var inject = require('gulp-inject');
var sass   = require('gulp-sass');
var gutil  = require('gulp-util');

gulp.task('build:index', function () {

  var scssSrc = gulp.src(['./src/scss/template.scss'], {read: true}).pipe(sass());
  var imgSrc  = gulp.src(['./src/images/template.jpg'], {read: true});

  return gulp.src('./src/index.html')
    .pipe(inject(scssSrc, {
      starttag: '/* {{name}}:{{ext}} */',
      endtag: '/* endinject */',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(imgSrc, {
        starttag: '<!-- profile:img -->',
        endtag: '<!-- endinject -->',
        relative: true,
        transform: function (filepath, file) {
          return '<img alt="Profile Image" src="data:image/png;base64,' + file.contents.toString('base64') + '" />';
        }
      }
    ))
    .pipe(gulp.dest('./'));
});
