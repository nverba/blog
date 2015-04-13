// function compileTagsFn(data){

//   var tags = {};

//   function eachPostFn(post) {

//     function allocateTagsFn(tag) {
//       tags[tag] = tags[tag] || [];
//       tags[tag].push(post.path);
//     }

//     post.tags.forEach(allocateTagsFn);
//   }

//   for (var filename in data) {
//     data[filename].posts.forEach(eachPostFn);
//   }

//   for (var tag in tags) {
//     fs.writeFile('dist/tags/' + tag + '.json', JSON.stringify(tags[tag]));
//     tags[tag] = tags[tag].length;
//   }

//   return new Buffer(JSON.stringify(tags), "utf-8");
// }

// gulp.task('build:tags',  ['build:index'], function() {

//   return gulp.src(['./dist/indexes/*.json', '!./dist/indexes/tags-index.json'])
//     .pipe(jsoncombine("tag-index.json", compileTagsFn))
//     .pipe(gulp.dest('./dist/indexes'));
// });
