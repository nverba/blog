var gulp            = require('gulp');
var map             = require('vinyl-map');
var fm              = require('html-frontmatter');
var ext_replace     = require('gulp-ext-replace');
var groupAggregate  = require('gulp-group-aggregate');


function buildIndexFn(src, dest) {

  var i = 0;
  var posts_per_page = 10;

  function createBufferFile(source, group, i) {

    var page      = { posts: source };
    group         =  parseInt(group, 10);
    page.previous = group === 0 ? false : (group - 1).toString(10);
    page.next     = group === Math.floor(i / posts_per_page) ? false : (group + 1).toString(10);

    return new Buffer(JSON.stringify(page), "utf-8");
  }

  var extractFrontmatter = map(function(code) {
    var data = fm(code.toString());
    return data ? JSON.stringify(data) : "{}";
  });

  var group = groupAggregate({

    group: function () {
      return Math.floor(i++ / posts_per_page); // group in batches
    },
    aggregate: function (group, files) {
      
      var output = files.map(function (file) {
        return JSON.parse(file.contents.toString());
      });

      return {
        path: group + '.json',
        contents: createBufferFile(output, group, i)
      };
    }
  });

  return gulp.src(src)
    .pipe(extractFrontmatter)
    .pipe(ext_replace('.json'))
    .pipe(group)
    .pipe(gulp.dest(dest));
}

gulp.task('build.index', ['build.flush'], function () {
  src  = './posts/*.*';
  dest = './build/indexes/pages';
  return buildIndexFn(src, dest);
});

gulp.task('build.index.test', ['build.flush.test'], function () {
  src  = './tests/fake_data/posts/*.*';
  dest = './tests/fake_data/indexes/pages';
  return buildIndexFn(src, dest);
});
