var gulp        = require('gulp');
var jsoncombine = require('gulp-jsoncombine');
var fs          = require('fs');

function buildTags(src, dest, tags_loc) {

  function compileTagsFn(data) {

    var tags = {};

    // Iterate post tags & create tag array & push post permalink path data

    function getTags(post) {

      function allocateTags(tag) {
        tags[tag] = tags[tag] || [];
        tags[tag].push(post.key);
      }

      post.tags.forEach(allocateTags);
    }

    // Iterate data & Pass each post to getTags

    for (var filename in data) {
      data[filename].posts.forEach(getTags);
    }

    // for completed tags object element, create new file in tags directory
    // then, replace tag path data with .length, i.e. number of documents referencing that tag

    for (var tag in tags) {
      fs.writeFile(tags_loc + tag + '.json', JSON.stringify(tags[tag]));
      tags[tag] = tags[tag].length;
    }

    // return tags as buffer to be passed to dest

    return new Buffer(JSON.stringify(tags), "utf-8");
  }

  return gulp.src(src)
    .pipe(jsoncombine("tags.json", compileTagsFn))
    .pipe(gulp.dest(dest));

}

gulp.task('build.tags', ['build.index'], function () {
  src  = ['./build/indexes/pages/*.json'];
  dest = './build/indexes/tags';
  tags_loc = './build/tags/';
  return buildTags(src, dest, tags_loc);
});

gulp.task('build.tags.test', ['build.index.test'], function () {
  src  = ['./tests/fake_data/indexes/pages/*.json'];
  dest = './tests/fake_data/indexes/tags';
  tags_loc = './tests/fake_data/tags/';
  return buildTags(src, dest, tags_loc);
});
